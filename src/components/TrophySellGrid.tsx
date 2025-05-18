import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Slider,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../config";

const MAX_DAILY_LIMIT_EUR = 5000;
const COIN_CONVERSION_RATE = 1000; // 1000 Coin = 1€

const TrophySellGrid: React.FC = () => {
  const [trophies, setTrophies] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  const fetchUserTrophies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/trophies/summary`, {
        headers,
      });

      const safeSummary = (res.data.summary || []).map((trophy: any) => ({
        ...trophy,
        value:
          trophy.value ??
          (trophy.totalValue && trophy.count
            ? Math.floor(trophy.totalValue / trophy.count)
            : 0),
      }));

      setTrophies(safeSummary);
      setQuantities({});
    } catch (err) {
      setSnack("Errore nel caricamento delle coppe possedute.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUserTrophies();
  }, []);

  const handleSubmitSell = async () => {
    const selections = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([type, quantity]) => {
        const trophy = trophies.find((t) => t.type === type);
        return {
          type,
          quantity,
          value: trophy?.value ?? 0,
        };
      });

    if (selections.length === 0) {
      setSnack("Seleziona almeno una coppa da vendere.");
      return;
    }

    const totalCoin = selections.reduce(
      (sum, item) => sum + item.quantity * item.value,
      0
    );
    const totalEur = totalCoin / COIN_CONVERSION_RATE;

    if (totalEur > MAX_DAILY_LIMIT_EUR) {
      setSnack(
        `Hai selezionato ${totalEur.toFixed(
          2
        )}€, che supera il limite giornaliero di ${MAX_DAILY_LIMIT_EUR}€`
      );
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${API_BASE_URL}/trophies/sell-to-system-bulk`,
        selections.map(({ type, quantity }) => ({ type, quantity })),
        { headers }
      );
      setSnack("Coppe inviate per la vendita.");
      fetchUserTrophies();
    } catch (err: any) {
      setSnack(err.response?.data?.message || "Errore durante la vendita.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCoin = Object.entries(quantities).reduce((sum, [type, qty]) => {
    const trophy = trophies.find((t) => t.type === type);
    return sum + (trophy?.value ?? 0) * qty;
  }, 0);

  const totalEur = totalCoin / COIN_CONVERSION_RATE;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "80vh" }}>
      <Typography variant="h5" color="white" textAlign="center" gutterBottom>
        Vendi le tue coppe
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {trophies.map((trophy) => {
          const currentQty = quantities[trophy.type] || 0;
          const displayValue = trophy.value ?? 0;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={trophy.type}>
              <Card sx={{ bgcolor: "#1e1e1e", color: "white", p: 2 }}>
                <CardMedia
                  component="img"
                  image={trophy.image}
                  alt={trophy.type}
                  sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}
                />
                <Typography
                  color="success.main"
                  fontWeight="bold"
                  textAlign="center"
                  gutterBottom
                >
                  {trophy.type}
                </Typography>
                <Typography variant="body2" color="grey.500" textAlign="center">
                  Disponibili: {trophy.count}
                </Typography>
                <Typography variant="body2" color="grey.500" textAlign="center">
                  {displayValue.toLocaleString()} Coin
                </Typography>

                <Typography
                  variant="body2"
                  color="white"
                  textAlign="center"
                  mt={1}
                >
                  Quantità da vendere: {currentQty}
                </Typography>
                <Slider
                  min={0}
                  max={trophy.count}
                  step={1}
                  value={currentQty}
                  onChange={(_, val) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [trophy.type]: val as number,
                    }))
                  }
                  sx={{ color: "success.main", mt: 1 }}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box
        mt={4}
        display="flex"
        justifyContent="space-between"
        sx={{ color: "success.main", fontWeight: "bold" }}
      >
        <Typography>{totalCoin.toLocaleString()} Coin</Typography>
        <Typography>
          ≈ {totalEur.toFixed(2)} € / {MAX_DAILY_LIMIT_EUR} €
        </Typography>
      </Box>
      {totalEur > MAX_DAILY_LIMIT_EUR && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Hai superato il limite giornaliero di prelievo!
        </Alert>
      )}

      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmitSell}
          disabled={submitting || totalEur > MAX_DAILY_LIMIT_EUR}
        >
          {submitting ? "Invio in corso..." : "Conferma vendita"}
        </Button>
      </Box>

      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default TrophySellGrid;
