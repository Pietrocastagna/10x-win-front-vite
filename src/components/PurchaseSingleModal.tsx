import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import axios from "axios";

interface Props {
  visible: boolean;
  medal: any;
  onClose: () => void;
  action: "buy" | "cancel" | null;
  refresh: () => void;
}

const calculateFinalPrice = (value: number) => Math.round(value * 1.1);

const PurchaseSingleModal: React.FC<Props> = ({
  visible,
  medal,
  onClose,
  action,
  refresh,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!visible || !medal) return null;

  const handleConfirm = async () => {
    if (!action) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      if (action === "buy") {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/shop/buy-single-medal`,
          { medalId: medal._id },
          { headers }
        );
      } else if (action === "cancel") {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/medals/remove-from-sale`,
          { medalId: medal._id },
          { headers }
        );
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        refresh();
      }, 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Errore, riprova.";
      alert(msg.includes("Saldo coin") ? "Saldo insufficiente." : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={visible} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ backgroundColor: "#1c1c1e", color: "#fff", pt: 3 }}>
        {success ? (
          <Fade in={success}>
            <Box textAlign="center" py={3}>
              <CheckCircle sx={{ fontSize: 80, color: "#00e676" }} />
              <Typography mt={2} fontWeight="bold" color="#00e676">
                Operazione completata!
              </Typography>
            </Box>
          </Fade>
        ) : (
          <>
            {action === "buy" && (
              <>
                <Typography
                  variant="h6"
                  textAlign="center"
                  fontWeight="bold"
                  color="#00e676"
                  mb={2}
                >
                  Conferma acquisto medaglia
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="#bbb">Prezzo base:</Typography>
                  <Typography color="#fff">
                    {medal.value.toLocaleString()} Coin
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="#bbb">Fee 10%:</Typography>
                  <Typography color="#fff">
                    {(medal.value * 0.1).toLocaleString()} Coin
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  fontWeight="bold"
                >
                  <Typography color="#bbb">Totale:</Typography>
                  <Typography color="#fff">
                    {calculateFinalPrice(medal.value).toLocaleString()} Coin
                  </Typography>
                </Box>
              </>
            )}
            {action === "cancel" && (
              <Typography
                textAlign="center"
                fontWeight="bold"
                color="#00e676"
                mt={2}
              >
                Vuoi annullare la vendita
                <br />
                di questa medaglia?
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={loading}
          >
            Annulla
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="success"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                <Typography>Elaborazione...</Typography>
              </Box>
            ) : (
              "Conferma"
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PurchaseSingleModal;
