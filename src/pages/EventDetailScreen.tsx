import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  Paper,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buttonStyles = {
  primary: {
    backgroundColor: "#00e676",
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#00ff88",
    },
  },
  secondary: {
    border: "1px solid #fff",
    color: "#fff",
    backgroundColor: "transparent",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  },
};

interface Participant {
  userId: string;
  username: string;
  tickets: number;
  joinedAt?: string;
}

const EventDetailScreen = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedMedalImage = (location.state as any)?.medalImage;

  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEventDetail = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(`${API_BASE_URL}/events/${eventId}/detail`, {
        headers,
      });

      const eventData = res.data.event;
      let participantList = res.data.participants;

      if (eventData.status === "completed" && eventData.winner?._id) {
        const winnerId = eventData.winner._id;
        participantList = [
          ...participantList.filter((p: Participant) => p.userId === winnerId),
          ...participantList.filter((p: Participant) => p.userId !== winnerId),
        ];
      }

      setEvent(eventData);
      setParticipants(participantList);
      setCanLoadMore(res.data.canLoadMore);
    } catch (err) {
      console.error("Errore caricamento evento", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreParticipants = async () => {
    try {
      setLoadingMore(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        `${API_BASE_URL}/events/${eventId}/participants?skip=${participants.length}`,
        { headers }
      );

      setParticipants((prev) => [...prev, ...res.data.participants]);
      setCanLoadMore(res.data.canLoadMore);
    } catch (err) {
      console.error("Errore caricamento partecipanti", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const goToUserProfile = (userId: string) => {
    navigate(`/app/profilo/${userId}`);
  };

  const goToMedalDetail = () => {
    if (event?.medalId) {
      navigate(`/app/medaglie/detail/${event.medalId}`);
    }
  };

  const imageToShow =
    event?.status === "completed"
      ? event?.medalImage || event?.image || null
      : passedMedalImage || event?.image || null;

  useEffect(() => {
    fetchEventDetail();
  }, []);

  if (loading || !event) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="success" />
        <Typography mt={2} color="success.main">
          Caricamento evento...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, py: 4, backgroundColor: "#111", minHeight: "100vh" }}>
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 5,
        }}
      >
        <Paper
          sx={{
            flex: 1,
            p: 3,
            backgroundColor: "#1c1c1e",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" color="#00e676" fontWeight="bold">
            {event.name}
          </Typography>
          <Typography color="#00e676">Stato: {event.status}</Typography>
          <Typography color="gray" fontSize={14}>
            {event.completedAt
              ? `Completato il: ${new Date(event.completedAt).toLocaleString()}`
              : "Evento in corso"}
          </Typography>
          <Typography color="gray" fontSize={14}>
            Ticket venduti: {event.totalTickets}/{event.participantsRequired}
          </Typography>

          {event.winner && (
            <Button
              variant="text"
              sx={{ mt: 1, color: "#ffd700", textTransform: "none" }}
              onClick={() => goToUserProfile(event.winner._id)}
            >
              🏆 Vincitore: {event.winner.username}
            </Button>
          )}

          {event.status !== "completed" && (
            <Typography mt={2} color="#ccc">
              {event.description}
            </Typography>
          )}
        </Paper>

        <Paper
          sx={{
            width: 250,
            minHeight: "100%",
            backgroundColor: "#1c1c1e",
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {imageToShow && (
            <Avatar
              src={imageToShow}
              alt="medal"
              variant="rounded"
              sx={{
                width: 160,
                height: 160,
                border: "2px solid #00e676",
                mb: 3,
              }}
            />
          )}

          {event.medalId && (
            <Button
              onClick={goToMedalDetail}
              fullWidth
              sx={buttonStyles.primary}
            >
              Vai alla medaglia
            </Button>
          )}
        </Paper>
      </Box>

      {event.status !== "completed" && (
        <Box maxWidth={1000} mx="auto" mb={4}>
          <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", borderRadius: 2 }}>
            <Typography color="#00e676" fontWeight="bold">
              🔥 L’evento è attivo! Iscriviti per vincere la medaglia in palio.
            </Typography>
          </Paper>
        </Box>
      )}

      <Box maxWidth={1000} mx="auto">
        <Typography variant="h6" color="white" mb={2}>
          Partecipanti
        </Typography>

        {participants.length === 0 ? (
          <Typography color="gray" textAlign="center">
            Nessun partecipante al momento.
          </Typography>
        ) : (
          participants.map((p: Participant) => {
            const isWinner = p.userId === event.winner?._id;
            return (
              <Paper
                key={p.userId}
                sx={{
                  p: 2,
                  mb: 1.5,
                  backgroundColor: "#1e1e1e",
                  borderLeft: isWinner ? "4px solid gold" : "4px solid #00e676",
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Button
                    onClick={() => goToUserProfile(p.userId)}
                    variant="text"
                    sx={{ color: "#00e676", textTransform: "none" }}
                  >
                    {p.username} {isWinner && "🏆"}
                  </Button>
                  {p.joinedAt && (
                    <Typography fontSize={12} color="gray">
                      Iscritto il: {new Date(p.joinedAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Typography color="#ccc" fontWeight="bold">
                  {p.tickets} Ticket
                </Typography>
              </Paper>
            );
          })
        )}

        {canLoadMore && (
          <Box mt={4} textAlign="center">
            <Button
              variant="outlined"
              onClick={loadMoreParticipants}
              disabled={loadingMore}
              sx={buttonStyles.secondary}
            >
              {loadingMore ? "Caricamento..." : "Carica altri..."}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EventDetailScreen;
