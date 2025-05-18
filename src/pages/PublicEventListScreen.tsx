import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PublicEventListScreen = () => {
  const { userId, username } = useParams(); // assicurati che la rotta includa questi parametri
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);

  const fetchEvents = async (pageNum = 0) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setMoreLoading(true);

      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        `${API_BASE_URL}/users/${userId}/dettagli-premi?skip=${
          pageNum * 100
        }&limit=100`,
        { headers }
      );

      if (pageNum === 0) setEvents(res.data);
      else setEvents((prev) => [...prev, ...res.data]);
    } catch (err) {
      console.error("Errore caricamento eventi pubblici:", err);
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(0);
  }, [userId]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress color="info" />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#111", minHeight: "100vh", p: 3 }}>
      <Typography variant="h5" color="#fff" mb={3}>
        Eventi partecipati da {username}
      </Typography>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card
              sx={{
                backgroundColor: "#222",
                color: "#fff",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="#00bcd4">
                  {event.eventTypeName}
                </Typography>
                <Typography variant="body2" color="#ccc" mt={1}>
                  {new Date(event.completedAt).toLocaleDateString()}
                </Typography>

                {event.medalImage && (
                  <Avatar
                    src={event.medalImage}
                    sx={{
                      width: 60,
                      height: 60,
                      mx: "auto",
                      my: 2,
                      border: "2px solid #00e676",
                    }}
                    alt="Medaglia"
                  />
                )}

                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={event.winnerId === userId ? "#ffd700" : "#ccc"}
                >
                  {event.winnerId === userId
                    ? `✨ Vittoria! (+${event.medalValue} Coin)`
                    : "Partecipazione"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {events.length >= 100 && !moreLoading && (
        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="info" onClick={loadMore}>
            Carica altri
          </Button>
        </Box>
      )}
      {moreLoading && (
        <Box mt={2} textAlign="center">
          <CircularProgress color="info" />
        </Box>
      )}
    </Box>
  );
};

export default PublicEventListScreen;
