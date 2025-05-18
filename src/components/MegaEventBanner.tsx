import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Fade,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface MegaEventBannerProps {
  megaEvent: {
    eventName: string;
    description: string;
    partecipanti: number;
    participantsRequired: number;
  };
}

const MegaEventBanner: React.FC<MegaEventBannerProps> = ({ megaEvent }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          backgroundColor: "#1e1e1e",
          p: 2,
          borderRadius: 2,
          mb: 3,
          boxShadow: "0 0 12px rgba(0, 230, 118, 0.3)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography color="#00e676" fontWeight="bold" fontSize={18}>
            🎖 Mega Evento: {megaEvent.eventName}
          </Typography>
          <IconButton
            onClick={() => setOpen(true)}
            size="small"
            sx={{ color: "#00e676" }}
          >
            <InfoIcon />
          </IconButton>
        </Box>

        <Typography color="#ccc" fontSize={14} textAlign="center">
          {megaEvent.description}
        </Typography>
        <Typography color="#ccc" fontSize={14} textAlign="center" mt={0.5}>
          Partecipanti: {megaEvent.partecipanti}/
          {megaEvent.participantsRequired}
        </Typography>
        <Typography color="#ccc" fontSize={14} textAlign="center">
          Costo Medaglia: +10% (ticket incluso)
        </Typography>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{ textAlign: "center", color: "#00e676", fontWeight: "bold" }}
        >
          Cos'è un Mega Evento?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#eee", textAlign: "center", fontSize: 14 }}>
            Ogni volta che acquisti una medaglia, il 10% del valore aggiuntivo
            serve per generare un biglietto valido per questo evento speciale.
            Nessun acquisto diretto di ticket: riceverai accesso partecipando
            con l'acquisto delle medaglie.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setOpen(false)}
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MegaEventBanner;
