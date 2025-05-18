import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventAnimationScreen = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [didWin, setDidWin] = useState(false);
  const [medalImage, setMedalImage] = useState("");
  const [username, setUsername] = useState("");
  const [showText, setShowText] = useState(false);

  const rotation = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const forceShowResult = () => {
    setLoading(false);
    setShowText(true);
  };

  useEffect(() => {
    const loadEventData = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      try {
        const res = await axios.get(`${API_BASE_URL}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const winner = res.data.winner?._id;
        const winnerUsername = res.data.winner?.username;
        setDidWin(winner === userId);
        setUsername(winnerUsername);

        const medalRes = await axios.get(
          `${API_BASE_URL}/events/${eventId}/medal`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMedalImage(medalRes.data.image);
      } catch (err) {
        console.error("Errore caricamento evento:", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setShowText(true);
        }, 4500);
      }
    };

    loadEventData();
  }, [eventId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #333, #0d0d13, #000)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        flexDirection: "column",
        zIndex: 9999,
        padding: 2,
      }}
    >
      {/* Skip & Close */}
      <IconButton
        onClick={forceShowResult}
        sx={{ position: "absolute", left: 20, top: 20, color: "white" }}
      >
        <SkipNextIcon />
      </IconButton>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ position: "absolute", right: 20, top: 20, color: "white" }}
      >
        <CloseIcon />
      </IconButton>

      {/* Medal Image */}
      {medalImage ? (
        <Fade in={!loading} timeout={2000}>
          <Box
            component="img"
            src={medalImage}
            alt="Medaglia"
            ref={imageRef}
            sx={{
              width: { xs: "180px", sm: "240px" },
              height: { xs: "180px", sm: "240px" },
              borderRadius: 2,
              mb: 4,
              boxShadow: 10,
              opacity: loading ? 0.3 : 1,
              transition: "opacity 1s ease",
            }}
          />
        </Fade>
      ) : (
        <CircularProgress color="success" sx={{ my: 4 }} />
      )}

      {/* Result Message */}
      {showText && (
        <Fade in={showText} timeout={1000}>
          <Box textAlign="center">
            {didWin ? (
              <Typography variant="h5" fontWeight="bold" color="#00e676">
                🎉 COMPLIMENTI HAI VINTO!
              </Typography>
            ) : (
              <>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#f44336"
                  sx={{ mb: 1 }}
                >
                  😓 QUESTA VOLTA NON HAI VINTO
                </Typography>
                <Button
                  variant="text"
                  color="info"
                  onClick={() => navigate(`/app/profilo/${username}`)}
                >
                  Vedi profilo di {username}
                </Button>
              </>
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default EventAnimationScreen;
