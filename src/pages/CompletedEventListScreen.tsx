// 📁 src/pages/CompletedEventListScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import { API_BASE_URL } from "../config"; // oppure usa import.meta.env se preferisci
import EventParticipationCard from "../components/EventParticipationCard";

const CompletedEventListScreen = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [medalTypes, setMedalTypes] = useState<any[]>([]);

  const fetchCompletedEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const [resEvents, resUser, resMedalTypes] = await Promise.all([
        axios.get(`${API_BASE_URL}/events/history?limit=200`, { headers }),
        axios.get(`${API_BASE_URL}/users/me`, { headers }),
        axios.get(`${API_BASE_URL}/medals-types`, { headers }),
      ]);

      setEvents(resEvents.data);
      setUserId(resUser.data._id);
      setMedalTypes(resMedalTypes.data);
    } catch (err) {
      console.error("Errore caricamento eventi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompletedEvents();
  }, [fetchCompletedEvents]);

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h5"
        color="#00e676"
        align="center"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Eventi Partecipati
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress color="success" />
        </Box>
      ) : events.length === 0 ? (
        <Typography color="gray" align="center" mt={5}>
          Nessun evento completato trovato.
        </Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
              <EventParticipationCard
                event={{
                  id: event.id,
                  eventType: event.eventTypeName,
                  completedAt: event.completedAt,
                  winnerId: event.winnerId,
                  winnerUsername: event.winnerUsername,
                  medalValue: event.medalValue,
                }}
                currentUserId={userId}
                medalTypes={medalTypes}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CompletedEventListScreen;
