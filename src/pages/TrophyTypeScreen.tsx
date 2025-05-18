import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
} from "@mui/material";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_LIMIT = 100;

const TrophyTypeScreen = ({ trophyType }: { trophyType: string }) => {
  const [trophies, setTrophies] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrophies = useCallback(
    async (reset = false) => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };

        if (reset) {
          setSkip(0);
          setHasMore(true);
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const res = await axios.get(
          `${API_BASE_URL}/trophies/me/${trophyType}?skip=${
            reset ? 0 : skip
          }&limit=${PAGE_LIMIT}`,
          { headers }
        );

        if (reset) {
          setTrophies(res.data);
        } else {
          setTrophies((prev) => [...prev, ...res.data]);
        }

        if (res.data.length < PAGE_LIMIT) {
          setHasMore(false);
        } else {
          setSkip((prev) => prev + PAGE_LIMIT);
        }
      } catch (err) {
        console.error("Errore:", err);
        setError("Impossibile caricare le coppe.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [trophyType, skip]
  );

  useEffect(() => {
    fetchTrophies(true);
  }, [fetchTrophies]);

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" color="white" fontWeight="bold">
          Coppe: {trophyType}
        </Typography>
        <Typography variant="h6" color="#00e676" fontWeight="bold">
          {trophies.length}x
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress color="success" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : trophies.length === 0 ? (
        <Typography color="gray" align="center" mt={5}>
          Nessuna coppa trovata.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {trophies.map((trophy) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={trophy._id}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "#fff",
                  boxShadow: "0 0 10px rgba(0, 230, 118, 0.2)",
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={trophy.image}
                  alt={trophy.type}
                  sx={{ objectFit: "contain", mt: 2 }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    color="#00e676"
                    fontWeight="bold"
                    align="center"
                  >
                    {trophy.value.toLocaleString()} Coin
                  </Typography>
                  <Typography variant="body2" color="gray" align="center">
                    ≈ € {(trophy.value / 1000).toFixed(2)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="gray"
                    align="center"
                    display="block"
                    mt={1}
                  >
                    {new Date(trophy.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {hasMore && !loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            onClick={() => fetchTrophies(false)}
            disabled={loadingMore}
            sx={{
              backgroundColor: "#00e676",
              color: "#000",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#00c965",
              },
            }}
          >
            {loadingMore ? "Caricamento..." : "Carica altre"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TrophyTypeScreen;
