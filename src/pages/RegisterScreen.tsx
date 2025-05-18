import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError("Email non valida");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });

      if (response.data.userId) {
        navigate("/verify-email", { state: { email } });
      }
    } catch (err) {
      setError("Errore durante la registrazione");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#1a1a1a", p: 2 }}
    >
      <Paper
        elevation={4}
        sx={{
          backgroundColor: "#2b2b2b",
          p: 4,
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ input: { color: "white" }, label: { color: "skyblue" } }}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          fullWidth
          margin="normal"
          sx={{ input: { color: "white" }, label: { color: "skyblue" } }}
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          fullWidth
          margin="normal"
          sx={{ input: { color: "white" }, label: { color: "skyblue" } }}
        />
        <TextField
          label="Conferma Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          fullWidth
          margin="normal"
          sx={{ input: { color: "white" }, label: { color: "skyblue" } }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{ mt: 3, backgroundColor: "skyblue", color: "#000" }}
        >
          Registrati
        </Button>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "skyblue",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Hai già un account? Accedi
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterScreen;
