// 📁 src/navigation/TabNavigator.tsx

import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

// Pages
import HomeScreen from "../pages/HomeScreen";
import EventScreen from "../pages/EventScreen";
import MedalListScreen from "../pages/MedalListScreen";
import ShopScreen from "../pages/ShopScreen";
import WalletScreen from "../pages/WalletScreen";
import MedalDetailScreen from "../pages/MedalDetailScreen";
import MedalTypeScreen from "../pages/MedalTypeScreen";
import TrophyTypeScreen from "../pages/TrophyTypeScreen";
import EventDetailScreen from "../pages/EventDetailScreen";
import MedalTypeShopScreen from "../pages/MedalTypeShopScreen";
import CompletedEventListScreen from "../pages/CompletedEventListScreen";
import EventAnimationScreen from "../pages/EventAnimationScreen";
import PublicUserProfileScreen from "../pages/PublicUserProfileScreen";
import PublicMedalListScreen from "../pages/PublicMedalListScreen";
import PublicEventListScreen from "../pages/PublicEventListScreen";
import SupportScreen from "../pages/SupportScreen";
import SupportMessagesScreen from "../pages/SupportMessagesScreen";
import FaqScreen from "../pages/FaqScreen";
import LogoutScreen from "../pages/LogoutScreen";

import { useParams } from "react-router-dom";

const MedalTypeShopScreenWrapper = () => {
  const { medalType } = useParams<{ medalType: string }>();
  if (!medalType) return null;
  return <MedalTypeShopScreen medalType={medalType} />;
};

const TabNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = (() => {
    if (location.pathname.startsWith("/app/events")) return "events";
    if (location.pathname.startsWith("/app/medaglie")) return "medaglie";
    if (location.pathname.startsWith("/app/shop")) return "shop";
    if (location.pathname.startsWith("/app/wallet")) return "wallet";
    if (location.pathname.startsWith("/app/home")) return "home";
    return "home";
  })();

  const [value, setValue] = useState(currentTab);

  useEffect(() => {
    setValue(currentTab);
  }, [currentTab]);

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <>
      {/* ✅ Route definitions */}
      <Routes>
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomeScreen />} />
        <Route path="events" element={<EventScreen />} />
        <Route path="events/detail/:eventId" element={<EventDetailScreen />} />
        <Route path="events/completed" element={<CompletedEventListScreen />} />
        <Route path="events/animation" element={<EventAnimationScreen />} />

        <Route
          path="shop/type/:medalType"
          element={<Route path="" element={<MedalTypeShopScreenWrapper />} />}
        />
        <Route path="medaglie" element={<MedalListScreen />} />
        <Route
          path="medaglie/detail/:medalId"
          element={<MedalDetailScreen />}
        />
        <Route path="medaglie/type/:medalType" element={<MedalTypeScreen />} />
        <Route path="coppe/type/:medalType" element={<TrophyTypeScreen />} />
        <Route path="shop" element={<ShopScreen />} />
        <Route path="shop/type/:medalType" element={<MedalTypeShopScreen />} />
        <Route path="wallet" element={<WalletScreen />} />
        <Route path="user/:userId" element={<PublicUserProfileScreen />} />
        <Route path="user/:userId/medals" element={<PublicMedalListScreen />} />
        <Route path="user/:userId/events" element={<PublicEventListScreen />} />
        <Route path="support" element={<SupportScreen />} />
        <Route path="support/messages" element={<SupportMessagesScreen />} />
        <Route path="faq" element={<FaqScreen />} />
        <Route path="logout" element={<LogoutScreen />} />
      </Routes>

      {/* ✅ Bottom Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderTop: "1px solid #222",
          backgroundColor: "#000",
        }}
        elevation={3}
      >
        <BottomNavigation value={value} onChange={handleChange} showLabels>
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
            sx={{ color: value === "home" ? "#00e676" : "#666" }}
          />
          <BottomNavigationAction
            label="Eventi"
            value="events"
            icon={<FlashOnIcon />}
            sx={{ color: value === "events" ? "#00e676" : "#666" }}
          />
          <BottomNavigationAction
            label="Medaglie"
            value="medaglie"
            icon={<EmojiEventsIcon />}
            sx={{ color: value === "medaglie" ? "#00e676" : "#666" }}
          />
          <BottomNavigationAction
            label="Shop"
            value="shop"
            icon={<ShoppingCartIcon />}
            sx={{ color: value === "shop" ? "#00e676" : "#666" }}
          />
          <BottomNavigationAction
            label="Wallet"
            value="wallet"
            icon={<AccountBalanceWalletIcon />}
            sx={{ color: value === "wallet" ? "#00e676" : "#666" }}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default TabNavigator;
