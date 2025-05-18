import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyEmailScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-code`, {
        email,
        code,
      });
      setSuccess("✅ Email verificata con successo!");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setSuccess("");
      setError("❌ Codice errato o scaduto");
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/resend-verification`, {
        email,
      });
      setSuccess("📩 Nuovo codice inviato all'email");
      setError("");
    } catch (err) {
      setSuccess("");
      setError("Errore durante l'invio del codice");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#1a1a1a", p: 2 }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#f9f9f9",
          p: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            textAlign: "center",
            color: "#111",
            mb: 2,
          }}
        >
          Verifica il tuo indirizzo email
        </Typography>

        <TextField
          label="Codice di verifica"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
          type="number"
          margin="normal"
          sx={{
            input: { backgroundColor: "#fff", color: "#000" },
            label: { color: "skyblue" },
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="info" sx={{ mt: 1 }}>
            {success}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleVerify}
          sx={{ mt: 3, backgroundColor: "skyblue", color: "#000" }}
        >
          Verifica
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "skyblue",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={handleResend}
        >
          Invia un nuovo codice
        </Typography>
      </Paper>
    </Box>
  );
};

export default VerifyEmailScreen;
