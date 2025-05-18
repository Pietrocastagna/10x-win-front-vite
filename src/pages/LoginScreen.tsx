import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      setError("");
      navigate("/app/home"); // sempre vai alla home
    } else if (result.error === "Email non verificata") {
      navigate("/verify-email", { state: { email } });
    } else {
      setError(result.error || "Credenziali errate");
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
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          type="email"
          sx={{ input: { color: "white" }, label: { color: "skyblue" } }}
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
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
          onClick={handleLogin}
          sx={{ mt: 3, backgroundColor: "skyblue", color: "#000" }}
        >
          Accedi
        </Button>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "skyblue",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/register")}
        >
          Non hai un account? Registrati
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginScreen;
