// 📁 src/pages/MedalTypeScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import axios from "axios";
import ConvertModal from "../components/ConvertModal";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getBadgeFromStatus = (status: string) => {
  switch (status) {
    case "for_sale":
      return {
        label: "IN VENDITA",
        backgroundColor: "#ffd700",
        textColor: "#000",
      };
    case "converted":
      return {
        label: "CONVERTITA",
        backgroundColor: "#00bcd4",
        textColor: "#000",
      };
    case "used":
      return { label: "USATA", backgroundColor: "#9c27b0", textColor: "#fff" };
    case "owned":
    default:
      return { label: "VINTO", backgroundColor: "#4caf50", textColor: "#fff" };
  }
};

const MedalTypeScreen = () => {
  const { medalType } = useParams<{ medalType: string }>();
  const [medals, setMedals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMedal, setSelectedMedal] = useState<any>(null);
  const [medalTypes, setMedalTypes] = useState<any[]>([]);
  const [conversionVisible, setConversionVisible] = useState(false);
  const [selectedConversionType, setSelectedConversionType] =
    useState<any>(null);

  const fetchMedalTypes = async () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get(`${API_BASE_URL}/medals-types`, { headers });
    setMedalTypes(res.data);
  };

  const fetchMedals = useCallback(
    async (reset = false) => {
      if (loadingMore || !medalType) return;

      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      if (reset) {
        setSkip(0);
        setHasMore(true);
      }

      try {
        if (!reset) setLoadingMore(true);
        const url = `${API_BASE_URL}/medals/me/${encodeURIComponent(
          medalType
        )}?skip=${reset ? 0 : skip}&limit=100`;

        console.log("✅ Fetching medals from:", url); // DEBUG

        const res = await axios.get(url, { headers });

        if (reset) {
          setMedals(res.data);
        } else {
          setMedals((prev) => [...prev, ...res.data]);
        }

        if (res.data.length < 100) {
          setHasMore(false);
        } else {
          setSkip((prev) => prev + 100);
        }
      } catch (err) {
        console.error("❌ Errore caricamento:", err);
        alert("Impossibile caricare le medaglie");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [medalType, skip, loadingMore]
  );

  useEffect(() => {
    setLoading(true);
    fetchMedalTypes();
    fetchMedals(true);
  }, [medalType]);

  const handleSell = async (medalId: string) => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post(
        `${API_BASE_URL}/medals/put-for-sale`,
        { medalId },
        { headers }
      );
      fetchMedals(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Errore generico");
    }
  };

  const handleRemove = async (medalId: string) => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post(
        `${API_BASE_URL}/medals/remove-from-sale`,
        { medalId },
        { headers }
      );
      fetchMedals(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Errore generico");
    }
  };

  const handleConvert = (medal: any) => {
    setSelectedMedal(medal);
    setConversionVisible(true);
  };

  return (
    <Box sx={{ p: 3, pb: 8, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" color="#00e676">
          Medaglie: {medalType}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography color="gray">{medals.length}x</Typography>
          <IconButton onClick={() => fetchMedals(true)}>
            <RefreshIcon sx={{ color: "#00bcd4" }} />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="success" />
        </Box>
      ) : medals.length === 0 ? (
        <Typography color="gray" textAlign="center">
          Nessuna medaglia trovata.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {medals.map((medal) => {
            const badge = getBadgeFromStatus(medal.status);
            const isUsed = medal.status === "used";
            const isForSale = medal.status === "for_sale";
            const isConverted = medal.status === "converted";
            const isOneK = medal.value === 1000;
            const isTenK = medal.value === 10000;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={medal._id}>
                <Box
                  sx={{
                    backgroundColor: "#1e1e1e",
                    borderRadius: 3,
                    p: 2,
                    textAlign: "center",
                    boxShadow: "0 0 10px #00e67655",
                    opacity: isUsed ? 0.5 : 1,
                    position: "relative",
                  }}
                >
                  {isUsed && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "#ffc107",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      USATA PER EVENTO
                    </Box>
                  )}
                  <img
                    src={medal.image}
                    alt={medal.type}
                    style={{ width: 60, height: 60, objectFit: "contain" }}
                  />
                  <Box mt={1}>
                    <Chip
                      label={badge.label}
                      sx={{
                        backgroundColor: badge.backgroundColor,
                        color: badge.textColor,
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                  <Typography color="#00e676" mt={1} fontWeight="bold">
                    {medal.type}
                  </Typography>
                  <Typography color="#ccc" mt={0.5} mb={1}>
                    Valore: {medal.value.toLocaleString()}
                  </Typography>

                  {!isConverted && !isUsed && !isOneK && (
                    <Box display="flex" justifyContent="center" mb={1}>
                      {isForSale ? (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleRemove(medal._id)}
                        >
                          Annulla
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<LocalOfferIcon />}
                          onClick={() => handleSell(medal._id)}
                        >
                          Vendi
                        </Button>
                      )}
                    </Box>
                  )}

                  <Box display="flex" justifyContent="center" gap={1}>
                    {!isConverted &&
                      !isUsed &&
                      !isOneK &&
                      !isTenK &&
                      !isForSale && (
                        <Button
                          variant="text"
                          size="small"
                          color="success"
                          startIcon={<AutorenewIcon />}
                          onClick={() => handleConvert(medal)}
                        >
                          Converti
                        </Button>
                      )}
                    <Button
                      variant="text"
                      size="small"
                      color="inherit"
                      startIcon={<InfoIcon />}
                      onClick={() =>
                        (window.location.href = `/app/medaglie/detail/${medal._id}`)
                      }
                    >
                      Dettaglio
                    </Button>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

      {hasMore && !loadingMore && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="info"
            onClick={() => fetchMedals(false)}
          >
            Carica altre
          </Button>
        </Box>
      )}
      {loadingMore && (
        <Box textAlign="center" mt={2}>
          <CircularProgress size={20} color="info" />
        </Box>
      )}

      <ConvertModal
        open={conversionVisible}
        medal={selectedMedal}
        onClose={() => {
          setConversionVisible(false);
          fetchMedals(true);
        }}
        selectedConversionType={selectedConversionType}
        setSelectedConversionType={setSelectedConversionType}
      />
    </Box>
  );
};

export default MedalTypeScreen;
