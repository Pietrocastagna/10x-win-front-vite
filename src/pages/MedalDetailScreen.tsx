// MedalDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ConvertModal from "../components/ConvertModal";
import SellModal from "../components/SellModal";
import PurchaseSingleModal from "../components/PurchaseSingleModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Medal {
  _id: string;
  type: string;
  value: number;
  image: string;
  status: "owned" | "for_sale" | "converted" | "used";
  owner: { _id: string; username: string } | string;
  originEvent?: {
    _id: string;
    eventType?: { name: string };
  };
  createdAt: string;
  fullHistory?: MedalHistoryEntry[];
}

interface MedalHistoryEntry {
  user?: { username: string };
  action: string;
  timestamp: string;
}

interface MedalType {
  _id: string;
  type: string;
  value: number;
  image: string;
}

const getBadgeFromStatus = (status: string) => {
  switch (status) {
    case "for_sale":
      return { label: "IN VENDITA", bg: "#ffd700", color: "#000" };
    case "converted":
      return { label: "CONVERTITA", bg: "#00bcd4", color: "#000" };
    case "used":
      return { label: "USATA", bg: "#9c27b0", color: "#fff" };
    case "owned":
    default:
      return { label: "VINTO", bg: "#4caf50", color: "#fff" };
  }
};

const buttonStyles = {
  primary: {
    backgroundColor: "#00e676",
    color: "#fff",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#00ff88" },
  },
  secondary: {
    border: "1px solid #fff",
    color: "#fff",
    backgroundColor: "transparent",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
  },
};

const MedalDetailScreen = () => {
  const { medalId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [medal, setMedal] = useState<Medal | null>(null);
  const [fullHistory, setFullHistory] = useState<MedalHistoryEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [medalTypes, setMedalTypes] = useState<MedalType[]>([]);
  const [selectedConversionType, setSelectedConversionType] =
    useState<MedalType | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, medalTypesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users/me`, { headers }),
        axios.get(`${API_BASE_URL}/medals-types`, { headers }),
      ]);

      setUserId(userRes.data._id);
      setMedalTypes(
        medalTypesRes.data.sort(
          (a: MedalType, b: MedalType) => b.value - a.value
        )
      );

      try {
        const medalRes = await axios.get(`${API_BASE_URL}/medals/${medalId}`, {
          headers,
        });
        const data: Medal = medalRes.data;
        setMedal(data);
        setFullHistory(data.fullHistory || []);
      } catch {
        const fallback = location.state;
        if (fallback?.medalImage && fallback?.medalValue) {
          setMedal({
            _id: medalId!,
            type: fallback.type || String(fallback.medalValue / 100),
            image: fallback.medalImage,
            value: fallback.medalValue,
            status: fallback.status || "owned",
            owner: { _id: fallback.ownerId, username: fallback.ownerName },
            originEvent: fallback.originEvent || null,
            createdAt: fallback.createdAt || new Date().toISOString(),
            fullHistory: [],
          });
        }
      }
    };

    fetchData();
  }, [medalId, location.state]);

  useEffect(() => {
    if (!medal || medalTypes.length === 0) return;
    const valid = medalTypes.filter(
      (t) => t.value < medal.value && t.value !== 10000
    );
    setSelectedConversionType(valid[0] || null);
  }, [medal, medalTypes]);

  if (!medal) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  const isOwner =
    userId &&
    (typeof medal.owner === "string"
      ? medal.owner === userId
      : medal.owner._id === userId);
  const isOnSale = medal.status === "for_sale";
  const isConverted = medal.status === "converted";
  const canConvert = medal.value > 10000 && !isConverted && !isOnSale;
  const canSell = medal.value >= 10000 && !isConverted;
  const canBuy = !isOwner && isOnSale;

  const handleCloseConvertModal = () => {
    setShowConvertModal(false);
    navigate("/app/medaglie");
  };

  const badge = getBadgeFromStatus(medal.status);

  return (
    <Box sx={{ backgroundColor: "#111", p: 3, minHeight: "100vh" }}>
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 5,
        }}
      >
        <Paper
          sx={{ flex: 1, p: 3, backgroundColor: "#1c1c1e", borderRadius: 2 }}
        >
          <Typography variant="h5" color="#00e676" fontWeight="bold">
            Medaglia da {medal.type}
          </Typography>
          <Typography color="#00e676" fontSize={18} fontWeight={600}>
            {medal.value.toLocaleString()} Coin
          </Typography>
          <Typography color="#ccc">
            Proprietario:{" "}
            <Button
              variant="text"
              sx={{ color: "#00e676", textTransform: "none" }}
              onClick={() =>
                navigate(
                  `/app/profile/${
                    typeof medal.owner === "string"
                      ? medal.owner
                      : medal.owner._id
                  }`
                )
              }
            >
              @{typeof medal.owner === "string" ? "N/D" : medal.owner.username}
            </Button>
          </Typography>
          <Typography color="#aaa" fontSize={13}>
            Evento: {medal.originEvent?.eventType?.name || "N/D"}
          </Typography>
          {medal.originEvent?._id && (
            <Typography fontSize={13} color="#00e676">
              ID Evento:{" "}
              <Button
                variant="text"
                sx={{ color: "#00e676", textTransform: "none", pl: 0 }}
                onClick={() =>
                  navigate(`/app/events/detail/${medal.originEvent!._id}`)
                }
              >
                {medal.originEvent._id}
              </Button>
            </Typography>
          )}
          <Typography color="#888" fontSize={13}>
            Creato il: {new Date(medal.createdAt).toLocaleString()}
          </Typography>
        </Paper>

        <Paper
          sx={{
            backgroundColor: "#1c1c1e",
            borderRadius: 2,
            p: 3,
            width: 250,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box position="relative" mb={3}>
            <Avatar
              variant="rounded"
              src={medal.image}
              alt="Medaglia"
              sx={{ width: 160, height: 160, border: "1px solid #444" }}
            />
            <Chip
              label={badge.label}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: badge.bg,
                color: badge.color,
                fontWeight: "bold",
              }}
            />
          </Box>

          {isOwner && !isConverted && (
            <>
              {canSell && (
                <Button
                  fullWidth
                  sx={{ ...buttonStyles.secondary, mb: 1 }}
                  onClick={() => setShowSellModal(true)}
                >
                  {isOnSale ? "Annulla vendita" : "Metti in vendita"}
                </Button>
              )}
              {canConvert && (
                <Button
                  fullWidth
                  sx={{ ...buttonStyles.primary }}
                  onClick={() => setShowConvertModal(true)}
                >
                  Converti
                </Button>
              )}
            </>
          )}

          {canBuy && (
            <Button
              fullWidth
              sx={{ ...buttonStyles.primary }}
              onClick={() => setShowBuyModal(true)}
            >
              Acquista medaglia
            </Button>
          )}
        </Paper>
      </Box>

      {fullHistory.length > 0 && (
        <Box maxWidth={1000} mx="auto">
          <Typography variant="h6" color="white" gutterBottom>
            Storia medaglia
          </Typography>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#1c1c1e",
              maxHeight: 400,
              overflow: "auto",
              borderRadius: 2,
            }}
          >
            {fullHistory.map((entry, index) => (
              <Box
                key={index}
                mb={2}
                p={2}
                sx={{
                  backgroundColor: "#222",
                  borderRadius: 2,
                  borderLeft: "4px solid #00e676",
                }}
              >
                <Typography color="#00e676" fontWeight={600}>
                  {entry.user?.username || "Utente sconosciuto"}
                </Typography>
                <Typography color="#ccc">Azione: {entry.action}</Typography>
                <Typography color="#999" fontSize={12}>
                  {new Date(entry.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      <ConvertModal
        open={showConvertModal}
        onClose={handleCloseConvertModal}
        medal={medal}
        selectedConversionType={selectedConversionType}
        setSelectedConversionType={setSelectedConversionType}
      />

      <SellModal
        open={showSellModal}
        onClose={() => setShowSellModal(false)}
        medal={medal}
        onSuccess={(updatedMedal: Medal) => setMedal(updatedMedal)}
      />

      <PurchaseSingleModal
        visible={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        medal={medal}
        action="buy"
        refresh={() => {
          setShowBuyModal(false);
          navigate("/app/medaglie");
        }}
      />
    </Box>
  );
};

export default MedalDetailScreen;
