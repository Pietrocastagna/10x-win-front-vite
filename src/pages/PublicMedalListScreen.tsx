import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PublicMedalListScreen = () => {
  const { userId } = useParams();
  const [medals, setMedals] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);

  const fetchMedals = async (pageNum = 0) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setMoreLoading(true);

      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        `${API_BASE_URL}/users/public/${userId}/medals?skip=${
          pageNum * 100
        }&limit=100`,
        { headers }
      );

      if (pageNum === 0) setMedals(res.data);
      else setMedals((prev) => [...prev, ...res.data]);
    } catch (err) {
      console.error("Errore caricamento medaglie utente:", err);
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchMedals(0);
  }, [userId]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMedals(next);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111",
        }}
      >
        <CircularProgress color="info" />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#111", minHeight: "100vh", p: 3 }}>
      <Typography variant="h5" color="#fff" mb={3}>
        Medaglie di questo utente
      </Typography>

      {medals.length === 0 ? (
        <Typography variant="body1" color="#aaa" textAlign="center" mt={4}>
          Nessuna medaglia trovata
        </Typography>
      ) : (
        <Stack spacing={2}>
          {medals.map((medal) => (
            <Card
              key={medal._id}
              sx={{ backgroundColor: "#222", borderRadius: 2 }}
            >
              <CardContent>
                <Typography color="#00bcd4" fontSize={16}>
                  {medal.type} - {medal.value.toLocaleString()} Coin
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {medals.length >= 100 && !moreLoading && (
        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="info" onClick={handleLoadMore}>
            Carica altri
          </Button>
        </Box>
      )}

      {moreLoading && (
        <Box textAlign="center" mt={2}>
          <CircularProgress color="info" />
        </Box>
      )}
    </Box>
  );
};

export default PublicMedalListScreen;
