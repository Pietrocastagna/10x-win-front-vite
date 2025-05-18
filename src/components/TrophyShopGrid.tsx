import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Modal,
  Slider,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../config";
import TrophySellGrid from "./TrophySellGrid";

const TrophyShopGrid: React.FC = () => {
  const [trophies, setTrophies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSelling, setIsSelling] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  const fetchAvailableTrophies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/shop/trophies-available`, {
        headers,
      });
      setTrophies(res.data?.summary || []);
    } catch (err: any) {
      setSnack("Errore nel caricamento delle coppe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableTrophies();
  }, []);

  const handleBuy = async () => {
    if (!selected) return;
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        `${API_BASE_URL}/shop/buy-trophies-from-system`,
        { type: selected.type, quantity },
        { headers }
      );
      setSnack(res.data.message || "Acquisto completato!");
      setSelected(null);
      setQuantity(1);
      fetchAvailableTrophies();
    } catch (err: any) {
      setSnack(err.response?.data?.message || "Errore durante l'acquisto");
    }
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" color="white">
          {isSelling ? "Vendi Coppe" : "Compra Coppe"}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setIsSelling((prev) => !prev)}
        >
          {isSelling ? "Torna ad acquista" : "Vendi le tue coppe"}
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="success" />
        </Box>
      ) : isSelling ? (
        <TrophySellGrid />
      ) : (
        <Grid container spacing={3}>
          {trophies.map((t, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
                <CardMedia
                  component="img"
                  image={t.image}
                  alt={t.type}
                  height="100"
                  sx={{ objectFit: "contain", padding: 2 }}
                />
                <CardContent>
                  <Typography color="success.main" fontWeight="bold">
                    {t.type}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {t.available} disponibili
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {t.value.toLocaleString()} Coin
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ mt: 1 }}
                    onClick={() => setSelected(t)}
                  >
                    Acquista
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal Acquisto */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        <Box
          sx={{
            bgcolor: "#1e1e1e",
            color: "#fff",
            p: 4,
            borderRadius: 2,
            width: 400,
            maxWidth: "90vw",
            mx: "auto",
            mt: "15vh",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Acquisto coppe: {selected?.type}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Valore unitario: {selected?.value.toLocaleString()} Coin
          </Typography>
          <Typography mt={2}>Quantità: {quantity}</Typography>
          <Slider
            min={1}
            max={Math.min(selected?.available || 10, 10)}
            step={1}
            value={quantity}
            onChange={(_, val) => setQuantity(val as number)}
            sx={{ color: "#00e676" }}
          />
          <Typography color="success.main" mt={1}>
            Totale: {(selected?.value * quantity).toLocaleString()} Coin
          </Typography>
          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" fullWidth onClick={handleBuy}>
              Conferma
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSelected(null);
                setQuantity(1);
              }}
            >
              Annulla
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        message={snack}
      />
    </Box>
  );
};

export default TrophyShopGrid;
