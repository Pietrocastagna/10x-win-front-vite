import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import VerifyEmailScreen from "./pages/VerifyEmailScreen";
import DrawerLayout from "./layouts/DrawerLayout";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { GlobalEventProvider } from "./context/GlobalEventContext";
import GlobalSocketListener from "./components/socket/GlobalSocketListener";
import NotificationBubble from "./components/socket/NotificationBubble";

import { ToastContainer, toast } from "react-toastify"; // Corretto import
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({ palette: { mode: "dark" } });

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/verify-email" element={<VerifyEmailScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/app/*" element={<DrawerLayout />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <GlobalEventProvider>
          <GlobalSocketListener />
          <AppRoutes />
          <NotificationBubble />
          <ToastContainer position="bottom-center" />
        </GlobalEventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
