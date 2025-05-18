// ✅ SellModal convertito per React Web + Material UI
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface Props {
  open: boolean;
  medal: any;
  onClose: () => void;
  onSuccess: (updatedMedal: any) => void;
}

const SellModal: React.FC<Props> = ({ open, medal, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const isOnSale = medal.status === "for_sale";

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const endpoint = isOnSale
        ? `${import.meta.env.VITE_API_BASE_URL}/medals/remove-from-sale`
        : `${import.meta.env.VITE_API_BASE_URL}/medals/put-for-sale`;

      await axios.post(endpoint, { medalId: medal._id }, { headers });

      const updated = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/medals/${medal._id}`,
        {
          headers,
        }
      );

      onSuccess(updated.data);
      onClose();
    } catch (err: any) {
      console.error("Errore durante la vendita:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Errore generico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        {isOnSale
          ? "Vuoi annullare la vendita di questa medaglia?"
          : "Vuoi mettere in vendita questa medaglia?"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="gray" textAlign="center">
          L'operazione sarà immediata e visibile nel marketplace.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
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
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Conferma"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellModal;
