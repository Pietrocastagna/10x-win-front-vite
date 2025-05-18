import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Button,
  ToggleButton,
} from "@mui/material";
import axios from "axios";
import PurchaseModal from "../components/PurchaseModal";
import TrophyShopGrid from "../components/TrophyShopGrid";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const medalValues = ["Tutte", "10K", "100K", "1M", "10M", "100M", "1B"];

const ShopScreen = () => {
  const [selectedTab, setSelectedTab] = useState("medals");
  const [valueFilters, setValueFilters] = useState(["Tutte"]);
  const [medalSummary, setMedalSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedal, setSelectedMedal] = useState<any>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, typesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/shop/summary`, { headers }),
        axios.get(`${API_BASE_URL}/medals-types`, { headers }),
      ]);

      const medals = summaryRes.data.summary
        .map((summaryItem: any) => {
          const typeInfo = typesRes.data.find(
            (t: any) => t.type === summaryItem.type
          );
          if (!typeInfo) return null;
          return {
            ...summaryItem,
            image: typeInfo.image,
            value: typeInfo.value,
            category: "medals",
          };
        })
        .filter(Boolean);

      setMedalSummary(medals);
    } catch (err) {
      console.error("Errore caricamento shop:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterClick = (val: string) => {
    if (val === "Tutte") return setValueFilters(["Tutte"]);
    setValueFilters((prev) =>
      prev.includes(val)
        ? prev.length === 1
          ? ["Tutte"]
          : prev.filter((f) => f !== val)
        : [...prev.filter((f) => f !== "Tutte"), val]
    );
  };

  const filtered = medalSummary.filter((item) => {
    if (selectedTab !== "medals") return false;
    if (valueFilters.includes("Tutte")) return true;
    return valueFilters.includes(item.type);
  });

  const handleGoToDetail = (type: string) => {
    navigate(`/app/shop/type/${type}`);
  };

  return (
    <Box sx={{ bgcolor: "#121212", p: 2, minHeight: "100vh" }}>
      <Typography
        variant="h5"
        color="white"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
      >
        Shop Medaglie
      </Typography>

      <Box sx={{ display: "flex", mb: 2 }}>
        <ToggleButton
          value="medals"
          selected={selectedTab === "medals"}
          onClick={() => {
            setSelectedTab("medals");
            setValueFilters(["Tutte"]);
          }}
          sx={{
            flex: 1,
            borderColor: selectedTab === "medals" ? "#00e676" : "transparent",
            color: selectedTab === "medals" ? "#00e676" : "#fff",
          }}
        >
          Medaglie
        </ToggleButton>
        <ToggleButton
          value="trophies"
          selected={selectedTab === "trophies"}
          onClick={() => {
            setSelectedTab("trophies");
            setValueFilters(["Tutte"]);
          }}
          sx={{
            flex: 1,
            borderColor: selectedTab === "trophies" ? "#00e676" : "transparent",
            color: selectedTab === "trophies" ? "#00e676" : "#fff",
          }}
        >
          Coppe
        </ToggleButton>
      </Box>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "center",
        }}
      >
        {medalValues.map((val) => (
          <Chip
            key={val}
            label={val}
            clickable
            onClick={() => handleFilterClick(val)}
            color={valueFilters.includes(val) ? "success" : "default"}
            sx={{ color: valueFilters.includes(val) ? "#000" : "#fff" }}
          />
        ))}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="success" />
        </Box>
      ) : selectedTab === "trophies" ? (
        <TrophyShopGrid />
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {filtered.map((medal, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Box
                sx={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 3,
                  p: 2,
                  textAlign: "center",
                  boxShadow: "0 0 10px #00e67688",
                }}
              >
                <img
                  src={medal.image}
                  alt={medal.type}
                  width={60}
                  height={60}
                  style={{ objectFit: "contain", marginBottom: 10 }}
                />
                <Typography color="#00e676" fontWeight="bold">
                  {medal.type}
                </Typography>
                <Typography color="#ccc">{medal.count} disponibili</Typography>
                <Typography color="#aaa" variant="body2" gutterBottom>
                  Min: {medal.minPrice.toLocaleString()} Coin
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => setSelectedMedal(medal)}
                  sx={{ mb: 1 }}
                >
                  Acquista
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  fullWidth
                  onClick={() => handleGoToDetail(medal.type)}
                >
                  Vedi tutte
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <PurchaseModal
        open={!!selectedMedal}
        medal={selectedMedal}
        onClose={() => setSelectedMedal(null)}
        onSuccess={fetchData}
      />
    </Box>
  );
};

export default ShopScreen;
