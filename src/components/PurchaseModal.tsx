import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Slider,
  Button,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

interface PurchaseModalProps {
  open: boolean;
  medal: any;
  onClose: () => void;
  onSuccess?: () => void; // ✅ aggiunto
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  medal,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuantity(1);
      setSuccess(false);
    }
  }, [open]);

  if (!medal) return null;

  const maxAvailable = Math.min(medal.count || 10, 10);
  const costPerMedal = Math.round(
    medal.minPrice ? medal.minPrice * 1.1 : medal.value * 1.1
  );
  const totalCost = costPerMedal * quantity;

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${API_BASE_URL}/shop/buy-medals`,
        { medalType: medal.type, quantity },
        { headers }
      );

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(); // ✅ chiamata opzionale
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Errore durante l'acquisto";
      if (msg.includes("Saldo coin insufficiente")) {
        alert("Saldo insufficiente. Ricarica Coin o riduci la quantità.");
      } else {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {success ? (
        <Fade in={success}>
          <Box textAlign="center" p={4}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
            <Typography variant="h6" color="success.main" mt={2}>
              Acquisto completato!
            </Typography>
          </Box>
        </Fade>
      ) : (
        <>
          <DialogTitle sx={{ fontWeight: "bold", color: "#00e676" }}>
            Acquista {medal.type}
          </DialogTitle>

          <DialogContent>
            <Typography variant="subtitle2" color="gray" gutterBottom>
              Prezzo unitario: {costPerMedal.toLocaleString()} Coin
            </Typography>

            <Typography gutterBottom>Quantità: {quantity}</Typography>
            <Slider
              value={quantity}
              min={1}
              max={maxAvailable}
              step={1}
              onChange={(_, val) => setQuantity(val as number)}
              sx={{ color: "#00e676" }}
            />

            <Typography align="center" fontWeight="bold" mt={2}>
              Totale: {totalCost.toLocaleString()} Coin
            </Typography>
            <Typography
              variant="caption"
              align="center"
              display="block"
              color="gray"
            >
              * Fee del 10% inclusa nel prezzo
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              color="inherit"
              fullWidth
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              variant="contained"
              onClick={handlePurchase}
              sx={{ bgcolor: "#00e676", color: "#000", ml: 2 }}
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#000" }} />
              ) : (
                "Conferma acquisto"
              )}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default PurchaseModal;
