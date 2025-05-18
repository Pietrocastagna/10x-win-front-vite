import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface TrophyGroup {
  type: string;
  image: string;
  count: number;
  totalValue: number;
  valuePerTrophy: number;
}

interface Props {
  filters: string[];
  onRefreshDone?: () => void;
}

const OwnedTrophiesGrid: React.FC<Props> = ({ filters, onRefreshDone }) => {
  const [loading, setLoading] = useState(true);
  const [trophies, setTrophies] = useState<TrophyGroup[]>([]);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTrophies = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(`${API_BASE_URL}/trophies/summary`, {
        headers,
      });

      setTrophies(res.data?.summary || []);
    } catch (err) {
      console.error("Errore fetch trofei:", err);
      setSnackbarMsg("Errore durante il recupero dei trofei.");
    } finally {
      setLoading(false);
      onRefreshDone?.();
    }
  }, [onRefreshDone]);

  useEffect(() => {
    fetchTrophies();
  }, [fetchTrophies]);

  const filtered = filters.includes("Tutte")
    ? trophies
    : trophies.filter((g) => filters.includes(g.type));

  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (filtered.length === 0) {
    return (
      <Typography
        variant="body1"
        textAlign="center"
        mt={4}
        color="text.secondary"
      >
        Nessuna coppa trovata.
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={3} mt={2}>
        {filtered.map((trophy, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Card
              sx={{
                backgroundColor: "#1e1e1e",
                color: "#fff",
                borderRadius: 2,
                boxShadow: "0 6px 20px rgba(0, 230, 118, 0.25)",
              }}
            >
              <CardMedia
                component="img"
                height="100"
                image={trophy.image}
                alt={trophy.type}
                sx={{ objectFit: "contain", padding: 2 }}
              />
              <CardContent>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {trophy.type}
                </Typography>
                <Typography variant="body2" color="gray">
                  {trophy.count}x possedute
                </Typography>
                <Typography variant="body2" color="gray">
                  Totale: {trophy.totalValue.toLocaleString()} Coin
                </Typography>
                <Typography variant="body2" color="gray" gutterBottom>
                  € {(trophy.totalValue / 1000).toFixed(2)}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() =>
                    navigate("/trophy/" + encodeURIComponent(trophy.type))
                  }
                >
                  Vedi tutte
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={4000}
        onClose={() => setSnackbarMsg(null)}
        message={snackbarMsg}
      />
    </>
  );
};

export default OwnedTrophiesGrid;
