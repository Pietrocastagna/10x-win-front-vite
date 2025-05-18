import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";

const trophyFilters = ["Tutte", "10K", "50K", "250K", "500K"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyTrophiesScreen = () => {
  const [trophies, setTrophies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tutte");

  const fetchTrophies = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/trophies/me`, { headers });
      setTrophies(res.data || []);
    } catch (err) {
      console.error("Errore caricamento coppe:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrophies();
  }, [fetchTrophies]);

  const filteredTrophies =
    filter === "Tutte"
      ? trophies
      : trophies.filter((t: any) => t.type === filter);

  return (
    <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Typography variant="h4" color="#fff" mb={3}>
        Le mie Coppe
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "center",
          mb: 3,
        }}
      >
        {trophyFilters.map((val) => (
          <Chip
            key={val}
            label={val}
            onClick={() => setFilter(val)}
            sx={{
              backgroundColor: filter === val ? "#00e676" : "#333",
              color: "#fff",
              fontWeight: 500,
              px: 2,
              py: 1,
              cursor: "pointer",
            }}
          />
        ))}
      </Box>

      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress color="success" />
        </Box>
      ) : filteredTrophies.length === 0 ? (
        <Typography
          sx={{ color: "#888", textAlign: "center", mt: 5 }}
          variant="body1"
        >
          Nessuna coppa trovata.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredTrophies.map((trophy, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 3,
                  p: 2,
                  width: 250,
                  height: 220,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 8px 18px rgba(0,230,118,0.15)",
                }}
              >
                <img
                  src={trophy.image}
                  alt={trophy.type}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "contain",
                    margin: "0 auto 10px",
                  }}
                />
                <Typography color="#00e676" fontWeight="bold" fontSize={16}>
                  {trophy.type}
                </Typography>
                <Typography color="#ccc" fontSize={14}>
                  Valore: {trophy.value.toLocaleString()} Coin
                </Typography>
                <Typography color="#ccc" fontSize={13}>
                  Status: {trophy.status}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyTrophiesScreen;
