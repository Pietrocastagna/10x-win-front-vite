import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import PurchaseSingleModal from "../components/PurchaseSingleModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MedalTypeShopScreen = ({ medalType }: { medalType: string }) => {
  const [medals, setMedals] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState<any>(null);
  const [action, setAction] = useState<"buy" | "cancel" | null>(null);
  const [userId, setUserId] = useState("");

  const fetchMedals = async (pageNum = 0) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setMoreLoading(true);

      const token = localStorage.getItem("authToken");
      const userIdStored = localStorage.getItem("userId");
      setUserId(userIdStored || "");

      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        `${API_BASE_URL}/medals/for-sale/${medalType}?skip=${
          pageNum * 100
        }&limit=100`,
        { headers }
      );

      if (pageNum === 0) {
        setMedals(res.data.medals);
      } else {
        setMedals((prev) => [...prev, ...res.data.medals]);
      }
    } catch (err) {
      console.error("Errore caricamento medaglie:", err);
      alert("Impossibile caricare le medaglie");
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchMedals(0);
  }, [medalType]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMedals(next);
  };

  const isMyMedal = (medal: any) => medal.owner?._id === userId;

  const refreshData = () => {
    fetchMedals(0);
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" color="#00e676">
          Medaglie: {medalType}
        </Typography>
        <Typography color="gray">{medals.length}x</Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="info" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {medals.map((medal) => {
            const myMedal = isMyMedal(medal);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={medal._id}>
                <Box
                  sx={{
                    backgroundColor: "#1e1e1e",
                    borderRadius: 3,
                    p: 2,
                    textAlign: "center",
                    boxShadow: "0 0 10px #00e67655",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={medal.image}
                    alt={medal.type}
                    style={{ width: 60, height: 60, marginBottom: 10 }}
                  />
                  <Typography color="#00e676" fontWeight="bold">
                    {medal.type}
                  </Typography>
                  {medal.ownerUsername && (
                    <Typography variant="caption" color="#ccc">
                      @{medal.ownerUsername}
                    </Typography>
                  )}
                  <Typography color="#ccc" mb={1}>
                    {medal.value.toLocaleString()} Coin
                  </Typography>
                  <Button
                    variant="contained"
                    color={myMedal ? "error" : "info"}
                    startIcon={myMedal ? <CancelIcon /> : <ShoppingCartIcon />}
                    onClick={() => {
                      setSelectedMedal(medal);
                      setAction(myMedal ? "cancel" : "buy");
                    }}
                    fullWidth
                  >
                    {myMedal ? "Annulla" : "Acquista"}
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

      {!loading && medals.length >= 100 && !moreLoading && (
        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="info" onClick={loadMore}>
            Carica altre
          </Button>
        </Box>
      )}
      {moreLoading && (
        <Box textAlign="center" mt={2}>
          <CircularProgress size={20} color="info" />
        </Box>
      )}

      <PurchaseSingleModal
        visible={!!selectedMedal}
        medal={selectedMedal}
        onClose={() => setSelectedMedal(null)}
        action={action}
        refresh={refreshData}
      />
    </Box>
  );
};

export default MedalTypeShopScreen;
