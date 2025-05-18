import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Fade,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MedalCard from "../components/MedalCard";
import EventParticipationCard from "../components/EventParticipationCard";
import { formatNumber } from "../utils/formatNumber";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PublicUserProfileScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const fadeIn = useRef(false);

  const [user, setUser] = useState<any>(null);
  const [medals, setMedals] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [medalTypes, setMedalTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resUser, resMedals, resEvents, resTypes] =
        await Promise.allSettled([
          axios.get(`${API_BASE_URL}/users/public/${userId}`),
          axios.get(`${API_BASE_URL}/users/public/${userId}/medals`),
          axios.get(`${API_BASE_URL}/users/public/${userId}/events`, {
            headers,
          }),
          axios.get(`${API_BASE_URL}/medals-types`, { headers }),
        ]);

      if (resUser.status === "fulfilled") setUser(resUser.value.data.user);
      if (resMedals.status === "fulfilled") setMedals(resMedals.value.data);
      if (resEvents.status === "fulfilled") setEvents(resEvents.value.data);
      if (resTypes.status === "fulfilled") setMedalTypes(resTypes.value.data);
    } catch (err) {
      console.error("Errore caricamento profilo pubblico:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
    fadeIn.current = true;
  }, [fetchData]);

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#121212"
      >
        <CircularProgress color="info" />
      </Box>
    );
  }

  const totalMedals = medals.length;
  const won = medals.filter((m) => m.origin === "win").length;
  const forSale = medals.filter((m) => m.status === "for_sale").length;

  const recentMedals = [...medals]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 10);

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h5"
        color="white"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Profilo di @{user?.username || "utente"}
      </Typography>

      <Fade in={fadeIn.current} timeout={1000}>
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: "#1c1c1e" }}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography color="#00e676" variant="subtitle2">
                Coin
              </Typography>
              <Typography color="white" fontWeight={600}>
                {formatNumber(user?.coinBalance?.total || 0)} Coin
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography color="#00e676" variant="subtitle2">
                Medaglie
              </Typography>
              <Typography color="white" fontWeight={600}>
                {formatNumber(totalMedals)}
              </Typography>
              <Typography variant="caption" color="gray">
                Vinte: {won}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography color="#00e676" variant="subtitle2">
                In vendita
              </Typography>
              <Typography color="white" fontWeight={600}>
                {formatNumber(forSale)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {recentMedals.length > 0 && (
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="white">Medaglie vinte</Typography>
            <Button
              size="small"
              onClick={() => navigate(`/app/medaglie/public/${userId}`)}
            >
              Vedi tutte
            </Button>
          </Box>
          <Grid container spacing={2}>
            {recentMedals.map((medal) => (
              <Grid item xs={12} sm={6} md={4} key={medal._id}>
                <MedalCard
                  medal={medal}
                  onPressDetail={() =>
                    navigate(`/app/medaglie/detail/${medal._id}`)
                  }
                  onAutoClose={() => {}}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {recentEvents.length > 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="white">Eventi partecipati</Typography>
            <Button
              size="small"
              onClick={() => navigate(`/app/eventi/public/${userId}`)}
            >
              Vedi tutti
            </Button>
          </Box>
          <Grid container spacing={2}>
            {recentEvents.map((event) => (
              <Grid item xs={12} sm={6} key={event._id}>
                <EventParticipationCard
                  event={{
                    id: event._id,
                    eventType: event.eventTypeName,
                    completedAt: event.completedAt,
                    winnerId: event.winnerId,
                    winnerUsername: event.winnerUsername,
                    medalValue: event.medalValue,
                  }}
                  currentUserId={userId || ""}
                  medalTypes={medalTypes}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default PublicUserProfileScreen;
