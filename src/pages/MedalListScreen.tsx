import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  ToggleButton,
  Button,
} from "@mui/material";

import SellAllMedalsModal from "../components/SellAllMedalsModal";
import OwnedTrophiesGrid from "../components/OwnedTrophiesGrid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const medalValues = ["Tutte", "1K", "10K", "100K", "1M", "10M", "100M", "1B"];
const trophyValues = ["Tutte", "10K", "50K", "250K", "500K"];

interface MedalGroup {
  type: string;
  count: number;
  image: string;
  category: "medals" | "trophies";
}

const MedalListScreen = () => {
  const [medalSummary, setMedalSummary] = useState<MedalGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<MedalGroup | null>(null);
  const [selectedTab, setSelectedTab] = useState<"medals" | "trophies">(
    "medals"
  );
  const [valueFilters, setValueFilters] = useState<string[]>(["Tutte"]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, typesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/medals/summary`, { headers }),
        axios.get(`${API_BASE_URL}/medals-types`, { headers }),
      ]);

      const merged: MedalGroup[] = summaryRes.data.summary
        .map((summaryItem: any) => {
          const foundType = typesRes.data.find(
            (typeItem: any) => typeItem.type === summaryItem.type
          );
          if (!foundType) return null;
          return {
            type: summaryItem.type,
            count: summaryItem.count,
            image: foundType.image,
            category: foundType.category || "medals",
          };
        })
        .filter((item: any) => item && item.count > 0);

      setMedalSummary(merged);
    } catch (err) {
      console.error("Errore caricamento medaglie:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSellAll = (group: MedalGroup) => setSelectedGroup(group);
  const handleViewAll = (type: string) => {
    window.location.href = `/app/medaglie/type/${type}`;
  };
  const handleSellAllSuccess = async () => {
    setSelectedGroup(null);
    await fetchData();
  };

  const handleFilterToggle = (val: string) => {
    if (val === "Tutte") {
      setValueFilters(["Tutte"]);
    } else {
      setValueFilters((prev) =>
        prev.includes(val)
          ? prev.length === 1
            ? ["Tutte"]
            : prev.filter((f) => f !== val)
          : [...prev.filter((f) => f !== "Tutte"), val]
      );
    }
  };

  const filtered = medalSummary.filter((item) => {
    const isCorrectTab = selectedTab === item.category;
    if (!isCorrectTab) return false;
    if (valueFilters.includes("Tutte")) return true;
    return valueFilters.includes(item.type);
  });

  return (
    <Box sx={{ bgcolor: "#121212", p: 2, minHeight: "100vh" }}>
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
        {(selectedTab === "medals" ? medalValues : trophyValues).map((val) => (
          <Chip
            key={val}
            label={val}
            clickable
            color={valueFilters.includes(val) ? "success" : "default"}
            onClick={() => handleFilterToggle(val)}
            sx={{ color: valueFilters.includes(val) ? "#000" : "#fff" }}
          />
        ))}
      </Box>

      {selectedTab === "medals" ? (
        loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {filtered.map((group, index) => (
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
                    src={group.image}
                    alt={group.type}
                    width={60}
                    height={60}
                    style={{ objectFit: "contain", marginBottom: 10 }}
                  />
                  <Typography color="#00e676" fontWeight="bold">
                    {group.type}
                  </Typography>
                  <Typography color="#ccc" mb={1}>
                    {group.count}x
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => handleSellAll(group)}
                    sx={{ mb: 1 }}
                  >
                    Vendi tutte
                  </Button>
                  <Button
                    variant="text"
                    color="inherit"
                    fullWidth
                    onClick={() => handleViewAll(group.type)}
                  >
                    Vedi tutte
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <OwnedTrophiesGrid filters={valueFilters} />
      )}

      <SellAllMedalsModal
        open={!!selectedGroup}
        type={selectedGroup?.type || ""}
        onClose={() => setSelectedGroup(null)}
        onSuccess={handleSellAllSuccess}
      />
    </Box>
  );
};

export default MedalListScreen;
