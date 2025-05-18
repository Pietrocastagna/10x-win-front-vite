// 📁 src/components/WithdrawalAccordionList.tsx

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import axios from "axios";

interface Withdrawal {
  _id: string;
  amount: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  requestDate: string;
  method?: string;
  transactionId?: string;
  trophyId?: string;
}

const formatCoin = (amount: number) => {
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + "M";
  if (amount >= 1_000) return (amount / 1_000).toFixed(1) + "K";
  return amount.toString();
};

const WithdrawalAccordionList: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchWithdrawals = async (initial = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token non trovato");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/withdrawals/me?skip=${
          initial ? 0 : skip
        }&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: Withdrawal[] = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setWithdrawals((prev) => (initial ? data : [...prev, ...data]));
      setSkip((prev) => prev + data.length);
      setHasMore(data.length === 10);
    } catch (err) {
      console.error("Errore prelievi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(true);
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  const getStatusIcon = (status: Withdrawal["status"]) => {
    switch (status) {
      case "pending":
        return <AccessTimeIcon sx={{ color: "#ffb300", fontSize: 18 }} />;
      case "accepted":
        return <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 18 }} />;
      case "rejected":
        return <CancelIcon sx={{ color: "#f44336", fontSize: 18 }} />;
      case "cancelled":
        return <BlockIcon sx={{ color: "#9e9e9e", fontSize: 18 }} />;
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      {withdrawals.length === 0 && !loading && (
        <Typography textAlign="center" sx={{ color: "#888", my: 4 }}>
          Nessun prelievo trovato.
        </Typography>
      )}

      {withdrawals.map((w) => {
        const coinAmount = Math.floor(w.amount * 1000);
        return (
          <Accordion
            key={w._id}
            expanded={expanded === w._id}
            onChange={(_, isExpanded) =>
              setExpanded(isExpanded ? w._id : false)
            }
            sx={{
              bgcolor: "#1e1e1e",
              color: "white",
              mb: 1,
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&::before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography sx={{ color: "#ccc" }}>
                  €{w.amount.toFixed(2)}
                </Typography>
                <Typography sx={{ color: "#00e676", fontWeight: "bold" }}>
                  {formatCoin(coinAmount)} Coin
                </Typography>
                {getStatusIcon(w.status)}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarMonthIcon fontSize="small" />
                <Typography fontSize={14}>
                  Data richiesta: {formatDate(w.requestDate)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CreditCardIcon fontSize="small" />
                <Typography fontSize={14}>Metodo: {w.method || "—"}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AutorenewIcon fontSize="small" />
                <Typography fontSize={14}>
                  ID transazione: {w.transactionId || "—"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <EmojiEventsIcon fontSize="small" />
                <Typography fontSize={14}>
                  Trophy ID: {w.trophyId || "—"}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {hasMore && !loading && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="info"
            onClick={() => fetchWithdrawals()}
          >
            Carica altri
          </Button>
        </Box>
      )}

      {loading && (
        <Box mt={3} display="flex" justifyContent="center">
          <CircularProgress color="success" />
        </Box>
      )}
    </Box>
  );
};

export default WithdrawalAccordionList;
