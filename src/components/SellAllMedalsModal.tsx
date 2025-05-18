import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

interface Props {
  open: boolean;
  type: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const SellAllMedalsModal: React.FC<Props> = ({
  open,
  type,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/medals/put-all-for-sale`,
        { type },
        { headers }
      );

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Errore generico";
      console.error("Errore durante la vendita multipla:", message);

      if (
        err?.response?.status === 400 &&
        message.includes("Nessuna medaglia")
      ) {
        alert(message);
        onSuccess?.();
        onClose();
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Vuoi mettere in vendita tutte le medaglie di tipo{" "}
        <Typography component="span" color="success.main" fontWeight="bold">
          {type}
        </Typography>
        ?
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <CircularProgress color="success" />
            <Typography color="success.main" mt={2}>
              Elaborazione in corso...
            </Typography>
          </Box>
        ) : null}
      </DialogContent>

      {!loading && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            color="inherit"
          >
            Annulla
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            fullWidth
            color="success"
          >
            Conferma
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default SellAllMedalsModal;
