import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SupportMessagesScreen = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/support/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Errore caricamento messaggi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <Box
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#111"
      >
        <CircularProgress color="info" />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#111", minHeight: "100vh", p: 4 }}>
      <Typography variant="h5" color="#fff" gutterBottom fontWeight="bold">
        Le tue richieste di supporto
      </Typography>

      {messages.length === 0 ? (
        <Typography color="#ccc" textAlign="center" mt={10}>
          Nessun messaggio trovato.
        </Typography>
      ) : (
        messages.map((msg, index) => (
          <Paper
            key={msg._id || index}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#222",
              borderLeft: `5px solid ${
                !msg.readByUser && msg.reply ? "#FFD700" : "#00bcd4"
              }`,
            }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" color="#00bcd4" fontWeight="bold">
                {msg.subject}
              </Typography>
              {!msg.readByUser && msg.reply && (
                <Chip label="Nuova risposta" color="warning" size="small" />
              )}
            </Grid>

            <Divider sx={{ my: 2, borderColor: "#444" }} />

            <Typography variant="subtitle2" color="#ccc">
              Messaggio:
            </Typography>
            <Typography color="#fff" mb={2}>
              {msg.message}
            </Typography>

            {msg.reply && (
              <>
                <Typography variant="subtitle2" color="#ccc">
                  Risposta:
                </Typography>
                <Typography color="#00ffff">{msg.reply}</Typography>
                <Typography color="#888" fontSize={12} mt={1}>
                  Risposto il: {new Date(msg.repliedAt).toLocaleString()}
                </Typography>
              </>
            )}

            <Typography color="#888" fontSize={12} mt={2}>
              Inviato il: {new Date(msg.createdAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: "#00bcd4",
            color: "#000",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            "&:hover": { bgcolor: "#00a0b3" },
          }}
          onClick={() => navigate("/support")}
        >
          Contatta il supporto
        </Button>
      </Box>
    </Box>
  );
};

export default SupportMessagesScreen;
