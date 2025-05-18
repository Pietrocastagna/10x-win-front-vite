import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface MedalType {
  _id: string;
  value: number;
  type: string;
  image: string;
}

interface Medal {
  _id: string;
  value: number;
  type: string;
  image: string;
}

interface ConvertModalProps {
  open: boolean;
  onClose: () => void;
  medal: Medal | null;
  selectedConversionType: MedalType | null;
  setSelectedConversionType: (medalType: MedalType) => void;
}

const formatNumber = (num: number) =>
  new Intl.NumberFormat("it-IT").format(Math.floor(num));

const ConvertModal: React.FC<ConvertModalProps> = ({
  open,
  onClose,
  medal,
  selectedConversionType,
  setSelectedConversionType,
}) => {
  const [medalTypes, setMedalTypes] = useState<MedalType[]>([]);
  const [conversions, setConversions] = useState<
    { m: MedalType; quantity: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedalTypes = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/medals-types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMedalTypes(res.data || []);
      } catch (err) {
        console.error("Errore caricamento tipi medaglia", err);
      }
    };

    if (open) fetchMedalTypes();
  }, [open]);

  useEffect(() => {
    if (!medal || medalTypes.length === 0) return;

    const valid = medalTypes
      .filter((m) => m.value < medal.value && m.value >= 10000)
      .sort((a, b) => b.value - a.value)
      .map((m) => ({
        m,
        quantity:
          medal.value === 1_000_000_000 && m.value === 100_000_000
            ? 10
            : medal.value / m.value,
      }));

    setConversions(valid);
    if (valid.length > 0) setSelectedConversionType(valid[0].m);
  }, [medal, medalTypes]);

  const handleConfirm = async () => {
    if (!medal || !selectedConversionType) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/medals/convert`,
        {
          medalId: medal._id,
          splitTo: selectedConversionType.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onClose();
    } catch (err: any) {
      console.error("Errore conversione", err);
      alert(err.response?.data?.message || "Errore generico");
    } finally {
      setLoading(false);
    }
  };

  const selectedConversion = conversions.find(
    (c) => c.m.value === selectedConversionType?.value
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ color: "#00e676", fontWeight: "bold", textAlign: "center" }}
      >
        Converti Medaglia
      </DialogTitle>

      <DialogContent sx={{ pb: 4 }}>
        {medal && (
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar src={medal.image} sx={{ width: 60, height: 60 }} />
          </Box>
        )}

        <Typography variant="body2" color="gray" mb={2} align="center">
          Scegli il tipo di conversione:
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {conversions.map(({ m }) => {
            const isSelected =
              selectedConversionType?.value === m.value &&
              selectedConversionType?.type === m.type;

            return (
              <Grid item key={m._id}>
                <Avatar
                  src={m.image}
                  onClick={() => setSelectedConversionType(m)}
                  sx={{
                    width: 60,
                    height: 60,
                    cursor: "pointer",
                    opacity: isSelected ? 1 : 0.3,
                    boxShadow: isSelected ? "0 0 10px #00e676" : "none",
                    transition: "all 0.3s",
                    mx: "auto",
                  }}
                />
              </Grid>
            );
          })}
        </Grid>

        {selectedConversion && (
          <Typography
            align="center"
            color="#00bcd4"
            fontWeight={500}
            mt={3}
            mb={1}
          >
            {formatNumber(selectedConversion.quantity)} x{" "}
            {selectedConversion.m.type}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" fullWidth>
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

export default ConvertModal;
