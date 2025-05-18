import React from "react";
import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";

// Import pagine (converti gli screen in pagine .tsx React web)
import {
  EmailScreen,
  PasswordScreen,
  VerifyPhoneScreen,
  KycScreen,
  PaymentsScreen,
  AddCardScreen,
  TwoFactorScreen,
  SessionsScreen,
  DevicesScreen,
  ParticipatedEventsScreen,
  WonMedalsScreen,
  CoinHistoryScreen,
  LanguageScreen,
  ThemeScreen,
  NotificationsScreen,
  SupportScreen,
  SupportMessagesScreen,
  FaqScreen,
  LogoutScreen,
} from "../pages"; // Sposta tutti gli screen qui

import TabNavigator from "../routes/TabNavigator"; // TabNavigator come gruppo di route

const DrawerLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar visibile sempre */}
      <Sidebar />

      {/* Area contenuti */}
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Routes>
          {/* Redirect /app a /app/home */}
          <Route path="/" element={<Navigate to="home" replace />} />

          {/* Inserisci il TabNavigator per gestire le route tab */}
          <Route path="/*" element={<TabNavigator />} />

          {/* Altre route indipendenti sotto /app */}
          <Route path="email" element={<EmailScreen />} />
          <Route path="password" element={<PasswordScreen />} />
          <Route path="verify-phone" element={<VerifyPhoneScreen />} />
          <Route path="kyc" element={<KycScreen />} />
          <Route path="payments" element={<PaymentsScreen />} />
          <Route path="add-card" element={<AddCardScreen />} />
          <Route path="2fa" element={<TwoFactorScreen />} />
          <Route path="sessions" element={<SessionsScreen />} />
          <Route path="devices" element={<DevicesScreen />} />
          <Route
            path="participated-events"
            element={<ParticipatedEventsScreen />}
          />
          <Route path="won-medals" element={<WonMedalsScreen />} />
          <Route path="coin-history" element={<CoinHistoryScreen />} />
          <Route path="language" element={<LanguageScreen />} />
          <Route path="theme" element={<ThemeScreen />} />
          <Route path="notifications" element={<NotificationsScreen />} />
          <Route path="support" element={<SupportScreen />} />
          <Route path="support-messages" element={<SupportMessagesScreen />} />
          <Route path="faq" element={<FaqScreen />} />
          <Route path="logout" element={<LogoutScreen />} />
        </Routes>

        {/* Placeholder per outlet se necessario */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DrawerLayout;
