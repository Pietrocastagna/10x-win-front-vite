// ✅ EventConfirmationModal.tsx - FIXED
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Slider,
  CircularProgress,
  Box,
  Avatar,
} from "@mui/material";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  event: any;
  ticketCount: number;
  setTicketCount: (n: number) => void;
  userTickets: number;
  isUnregisterMode: boolean;
}

const buttonStyles = {
  primary: {
    bgcolor: "#00e676",
    color: "#000",
    fontWeight: 600,
    ":hover": { bgcolor: "#00ff88" },
  },
  secondary: {
    color: "#fff",
    borderColor: "#fff",
    ":hover": { bgcolor: "rgba(255,255,255,0.1)" },
  },
};

const EventConfirmationModal: React.FC<Props> = ({
  open,
  onClose,
  event,
  onConfirm,
  ticketCount,
  setTicketCount,
  userTickets,
  isUnregisterMode,
}) => {
  const [assetImage, setAssetImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isCoin = event?.tipoPagamento === "coin";
  const isMedal = event?.tipoPagamento === "medaglia";
  const isTrophy = event?.tipoPagamento === "coppa";
  const allowMultiple = event?.allowMultipleTickets;

  const unitCost = isCoin
    ? event?.ticketCost || 0
    : isMedal
    ? event?.medalPricePerTicket || 0
    : event?.trophyPricePerTicket || 0;

  const maxTickets = event?.maxTicketsPerUser || 1;
  const additionalTickets = ticketCount - userTickets;
  const totalCost = unitCost * additionalTickets;

  const isBuyingMore =
    allowMultiple && event?.registered && !isUnregisterMode && userTickets > 0;

  const fetchAssetImage = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      if (isMedal && event?.medagliaPagamento) {
        const res = await axios.get(
          `${API_BASE_URL}/medals-types/${event.medagliaPagamento}`,
          { headers }
        );
        setAssetImage(res.data?.image);
      }

      if (isTrophy && event?.trophyPagamento) {
        const res = await axios.get(
          `${API_BASE_URL}/trophy-types/${event.trophyPagamento}`,
          { headers }
        );
        setAssetImage(res.data?.image);
      }
    } catch (err) {
      console.error("Errore caricamento immagine asset:", err);
    }
  };

  useEffect(() => {
    if (open && !isUnregisterMode && !isCoin) {
      fetchAssetImage();
    }
  }, [open]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (err) {
      console.error("Errore nella conferma:", err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ color: "#00e676", textAlign: "center" }}>
        {isUnregisterMode
          ? "Conferma disiscrizione"
          : isBuyingMore
          ? "Acquista altri ticket"
          : "Conferma iscrizione"}
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", bgcolor: "#1c1c1e" }}>
        {isUnregisterMode ? (
          <Typography sx={{ color: "#ccc" }}>
            Sei sicuro di voler annullare la tua iscrizione? Tutti i ticket o le
            risorse saranno rimborsati.
          </Typography>
        ) : (
          <>
            {allowMultiple && (
              <>
                <Typography sx={{ color: "#fff", mb: 1 }}>
                  Ticket: {ticketCount}
                </Typography>
                <Slider
                  value={ticketCount}
                  onChange={(_, val) => setTicketCount(val as number)}
                  step={1}
                  marks
                  min={isBuyingMore ? userTickets : 1}
                  max={maxTickets}
                  sx={{ color: "#00e676", mb: 2 }}
                />
              </>
            )}

            <Typography sx={{ color: "#00bcd4", mb: 2 }}>
              Costo: {totalCost}{" "}
              {isCoin ? "Coin" : isMedal ? "Medaglie" : "Coppe"}
            </Typography>

            {assetImage && (
              <Avatar
                src={assetImage}
                alt="medaglia/coppia"
                sx={{ width: 60, height: 60, mx: "auto", mb: 2 }}
              />
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: "column", gap: 1, px: 3, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirm}
          disabled={
            loading ||
            (!isUnregisterMode && isBuyingMore && ticketCount === userTickets)
          }
          sx={buttonStyles.primary}
        >
          {loading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={20} color="inherit" />
              Elaborazione...
            </Box>
          ) : (
            "Conferma"
          )}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={buttonStyles.secondary}
        >
          Annulla
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventConfirmationModal;
