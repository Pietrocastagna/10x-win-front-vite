// 📁 src/components/SidebarItems.tsx
import React from "react";
import {
  Person,
  Mail,
  Lock,
  Call,
  Description,
  CreditCard,
  Add,
  Security,
  Key,
  AccessTime,
  PhoneAndroid,
  ShowChart,
  FlashOn,
  EmojiEvents,
  History,
  Settings,
  Language,
  Palette,
  Notifications,
  Help,
  QuestionAnswer,
  Info,
  Logout,
  ExitToApp,
} from "@mui/icons-material";

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  route?: string;
}

export interface SidebarSection {
  key: string;
  label: string;
  icon: React.ReactNode;
  items: SidebarItem[];
}

export const sidebarItems: SidebarSection[] = [
  {
    key: "account",
    label: "Account",
    icon: <Person />,
    items: [
      { label: "Modifica email", icon: <Mail />, route: "/email" },
      { label: "Modifica password", icon: <Lock />, route: "/password" },
      { label: "Verifica telefono", icon: <Call />, route: "/verify-phone" },
      { label: "KYC / Documenti", icon: <Description />, route: "/kyc" },
    ],
  },
  {
    key: "payments",
    label: "Pagamenti",
    icon: <CreditCard />,
    items: [
      {
        label: "Metodi di pagamento",
        icon: <CreditCard />,
        route: "/payments",
      },
      { label: "Aggiungi carta", icon: <Add />, route: "/add-card" },
    ],
  },
  {
    key: "security",
    label: "Sicurezza",
    icon: <Security />,
    items: [
      { label: "2FA", icon: <Key />, route: "/2fa" },
      { label: "Sessioni attive", icon: <AccessTime />, route: "/sessions" },
      {
        label: "Dispositivi collegati",
        icon: <PhoneAndroid />,
        route: "/devices",
      },
    ],
  },
  {
    key: "activity",
    label: "Attività",
    icon: <ShowChart />,
    items: [
      {
        label: "Eventi partecipati",
        icon: <FlashOn />,
        route: "/events/participated",
      },
      { label: "Medaglie vinte", icon: <EmojiEvents />, route: "/medals/won" },
      { label: "Cronologia Coin", icon: <History />, route: "/coin-history" },
    ],
  },
  {
    key: "system",
    label: "Impostazioni app",
    icon: <Settings />,
    items: [
      { label: "Lingua", icon: <Language />, route: "/language" },
      { label: "Tema", icon: <Palette />, route: "/theme" },
      { label: "Notifiche", icon: <Notifications />, route: "/notifications" },
    ],
  },
  {
    key: "support",
    label: "Supporto",
    icon: <Help />,
    items: [
      {
        label: "Contatta supporto",
        icon: <QuestionAnswer />,
        route: "/support",
      },
      {
        label: "Lista Richieste supporto",
        icon: <QuestionAnswer />,
        route: "/support/messages",
      },
      { label: "FAQ", icon: <Info />, route: "/faq" },
    ],
  },
  {
    key: "logout",
    label: "Logout",
    icon: <Logout />,
    items: [{ label: "Esci dall'account", icon: <ExitToApp /> }],
  },
];
