import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SupportScreen = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: "error", message: "Compila tutti i campi." });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_BASE_URL}/support`,
        { subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedback({
        type: "success",
        message: "Messaggio inviato. Risponderemo il prima possibile.",
      });
      setSubject("");
      setMessage("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Errore durante l'invio.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 4 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#00bcd4"
        mb={3}
        textAlign="center"
      >
        Contatta il supporto
      </Typography>

      <Box
        component="form"
        sx={{
          maxWidth: 600,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Oggetto"
          fullWidth
          variant="outlined"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          InputLabelProps={{ style: { color: "#aaa" } }}
          InputProps={{
            style: {
              color: "#fff",
              backgroundColor: "#1e1e1e",
              borderColor: "#00bcd4",
            },
          }}
        />

        <TextField
          label="Descrivi il problema"
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputLabelProps={{ style: { color: "#aaa" } }}
          InputProps={{
            style: {
              color: "#fff",
              backgroundColor: "#1e1e1e",
              borderColor: "#00bcd4",
            },
          }}
        />

        <Button
          variant="contained"
          color="info"
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            fontWeight: "bold",
            mt: 1,
            backgroundColor: "#00bcd4",
            color: "#000",
            "&:hover": {
              backgroundColor: "#00a0b3",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Invia richiesta"
          )}
        </Button>
      </Box>

      {feedback && (
        <Snackbar
          open
          autoHideDuration={5000}
          onClose={() => setFeedback(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setFeedback(null)}
            severity={feedback.type}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default SupportScreen;
