import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  ToggleButton,
  Chip,
  Grid,
  Paper,
} from "@mui/material";
import EventCard from "../components/EventCard";
import EventConfirmationModal from "../components/EventConfirmationModal";
import MegaEventBanner from "../components/MegaEventBanner";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MEDALS_API = `${API_BASE_URL}/medals-types`;
const TROPHIES_API = `${API_BASE_URL}/trophy-types`;
const EVENTS_API = `${API_BASE_URL}/events/list/upcoming`;

const medalValues = ["Tutte", "1K", "10K", "100K", "1M", "10M", "100M", "1B"];
const trophyValues = ["Tutte", "10K", "50K", "250K", "500K"];

const EventScreen: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [medalsMap, setMedalsMap] = useState<Record<string, string>>({});
  const [trophiesMap, setTrophiesMap] = useState<
    Record<string, { type: string; image: string }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [snackMessage, setSnackMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [userTickets, setUserTickets] = useState(0);
  const [userId, setUserId] = useState("");
  const [isUnregisterMode, setIsUnregisterMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"medals" | "trophies">(
    "medals"
  );
  const [valueFilters, setValueFilters] = useState<string[]>(["Tutte"]);

  const fetchMedals = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const res = await axios.get(MEDALS_API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const map: Record<string, string> = {};
    res.data.forEach((medal: any) => {
      map[medal._id] = medal.type;
    });
    setMedalsMap(map);
  }, []);

  const fetchTrophies = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const res = await axios.get(TROPHIES_API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const map: Record<string, { type: string; image: string }> = {};
    res.data.forEach((trophy: any) => {
      map[trophy._id] = { type: trophy.type, image: trophy.image };
    });
    setTrophiesMap(map);
  }, []);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId || "");
      const response = await axios.get(EVENTS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Promise.all([fetchMedals(), fetchTrophies()]);
      const enriched = response.data.map((item: any) => {
        const eventType = item.eventType;
        const myTicketsCount = item.participants.filter(
          (p: any) =>
            p.userId === storedUserId ||
            p.userId?._id === storedUserId ||
            p.userId?.toString() === storedUserId
        ).length;
        return {
          instanceId: item._id,
          eventTypeId: eventType._id,
          eventName: eventType.name,
          description: eventType.description,
          tipoPagamento: eventType.tipoPagamento,
          ticketCost: eventType.ticketCost,
          medalPricePerTicket: eventType.medalPricePerTicket,
          maxTicketsPerUser: eventType.maxTicketsPerUser,
          allowMultipleTickets: eventType.allowMultipleTickets,
          participantsRequired: eventType.participantsRequired,
          medagliaPagamento: eventType.medagliaPagamento,
          medagliaVincita: eventType.medagliaVincita,
          trophyPagamento: eventType.trophyPagamento,
          trofeoVincita: eventType.trofeoVincita,
          partecipanti: item.participants.length,
          registered: myTicketsCount > 0,
          myTickets: myTicketsCount,
          isMegaEvent: eventType.isMegaEvent || false,
          isActive: eventType.isActive,
          trophyPricePerTicket: eventType.trophyPricePerTicket,
        };
      });
      setEvents(enriched);
    } catch (error) {
      console.error("❌ Errore nel recupero eventi:", error);
      setSnackMessage("Errore nel recupero eventi");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMedals, fetchTrophies]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRegistrationToggle = (event: any, isBuyMore = false) => {
    setSelectedEvent(event);
    setIsUnregisterMode(event.registered && !isBuyMore);
    const alreadyOwned = event.myTickets || 0;
    setTicketCount(
      isBuyMore ? alreadyOwned + 1 : alreadyOwned > 0 ? alreadyOwned : 1
    );
    setUserTickets(alreadyOwned);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    const token = localStorage.getItem("authToken");
    if (!selectedEvent) return;
    try {
      const endpoint = isUnregisterMode
        ? `${API_BASE_URL}/events/cancel`
        : `${API_BASE_URL}/events/join`;
      const payload = isUnregisterMode
        ? { eventId: selectedEvent.instanceId }
        : {
            eventTypeId: selectedEvent.eventTypeId,
            tickets: ticketCount - userTickets,
          };
      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackMessage(
        isUnregisterMode ? "Disiscrizione completata" : "Iscrizione completata"
      );
      await fetchEvents();
    } catch (err) {
      console.error("Errore registrazione/deregistrazione:", err);
      setSnackMessage("Errore durante l’operazione");
    } finally {
      setShowModal(false);
      setShowSnackbar(true);
    }
  };

  const megaEvent = events.find((e) => e.isMegaEvent);
  const filteredEvents = events.filter((e) => {
    if (e.isMegaEvent) return false;
    const isCorrectTab =
      selectedTab === "medals" ? e.medagliaVincita : e.trofeoVincita;
    if (!isCorrectTab) return false;
    if (valueFilters.includes("Tutte")) return true;
    const value =
      selectedTab === "medals"
        ? medalsMap[e.medagliaVincita] || ""
        : trophiesMap[e.trofeoVincita]?.type || "";
    return valueFilters.includes(value);
  });

  const handleFilterToggle = (val: string) => {
    if (val === "Tutte") {
      setValueFilters(["Tutte"]);
    } else {
      setValueFilters((prev) =>
        prev.includes(val)
          ? prev.length === 1
            ? ["Tutte"]
            : prev.filter((f) => f !== val)
          : [...prev.filter((f) => f !== "Tutte"), val]
      );
    }
  };

  return (
    <Box sx={{ bgcolor: "#121212", p: 2, minHeight: "100vh" }}>
      <Box sx={{ display: "flex", mb: 2 }}>
        <ToggleButton
          value="medals"
          selected={selectedTab === "medals"}
          onClick={() => {
            setSelectedTab("medals");
            setValueFilters(["Tutte"]);
          }}
          sx={{
            flex: 1,
            borderColor: selectedTab === "medals" ? "#00e676" : "transparent",
            color: selectedTab === "medals" ? "#00e676" : "#fff",
          }}
        >
          Eventi per Medaglie
        </ToggleButton>
        <ToggleButton
          value="trophies"
          selected={selectedTab === "trophies"}
          onClick={() => {
            setSelectedTab("trophies");
            setValueFilters(["Tutte"]);
          }}
          sx={{
            flex: 1,
            borderColor: selectedTab === "trophies" ? "#00e676" : "transparent",
            color: selectedTab === "trophies" ? "#00e676" : "#fff",
          }}
        >
          Eventi per Coppe
        </ToggleButton>
      </Box>

      {megaEvent && <MegaEventBanner megaEvent={megaEvent} />}

      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "center",
        }}
      >
        {(selectedTab === "medals" ? medalValues : trophyValues).map((val) => (
          <Chip
            key={val}
            label={val}
            clickable
            color={valueFilters.includes(val) ? "success" : "default"}
            onClick={() => handleFilterToggle(val)}
            sx={{ color: valueFilters.includes(val) ? "#000" : "#fff" }}
          />
        ))}
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress color="success" />
        </Box>
      ) : filteredEvents.length === 0 ? (
        <Typography color="gray" textAlign="center" mt={4}>
          Nessun evento disponibile.
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {filteredEvents.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.instanceId}>
              <EventCard
                event={item}
                onRegistrationToggle={handleRegistrationToggle}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={snackMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <EventConfirmationModal
        open={showModal}
        event={selectedEvent}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmAction}
        ticketCount={ticketCount}
        setTicketCount={setTicketCount}
        userTickets={userTickets}
        isUnregisterMode={isUnregisterMode}
      />
    </Box>
  );
};

export default EventScreen;
