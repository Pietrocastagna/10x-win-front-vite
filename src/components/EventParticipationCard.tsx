import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

interface Event {
  _id: string;
  id: string;
  eventType: string;
  completedAt: string;
  winnerId: string | null;
  winnerUsername?: string;
  medalValue: number | null;
  [key: string]: any;
}

interface Props {
  event: {
    id: string;
    eventType: string;
    completedAt: string;
    winnerId: string | null;
    winnerUsername?: string;
    medalValue: number | null;
  };
  currentUserId: string;
  medalTypes: { value: number; image: string }[];
}

const EventParticipationCard: React.FC<Props> = ({
  event,
  currentUserId,
  medalTypes,
}) => {
  const navigate = useNavigate();

  const isWinner = event.winnerId === currentUserId;
  const winnerName = isWinner
    ? event.winnerUsername || "Tu"
    : event.winnerUsername || "-";

  const medalImage =
    medalTypes.find((m) => m.value === event.medalValue)?.image || "";

  const handleGoToProfile = () => {
    if (event.winnerId) {
      navigate(`/app/profilo/${event.winnerId}`);
    }
  };

  const handleGoToEvent = () => {
    navigate(`/app/events/detail/${event.id}`);
  };

  return (
    <Paper
      elevation={5}
      sx={{
        bgcolor: "#1c1c1e",
        color: "#fff",
        p: 2,
        borderRadius: 2,
        maxWidth: 300,
        mx: "auto",
        mb: 3,
        boxShadow: "0 4px 10px rgba(0,230,118,0.3)",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        {medalImage ? (
          <Avatar
            src={medalImage}
            sx={{ width: 50, height: 50, mr: 2, border: "2px solid #00e676" }}
          />
        ) : (
          <Avatar sx={{ width: 50, height: 50, mr: 2, bgcolor: "#555" }}>
            <Typography fontSize={10}>No Medal</Typography>
          </Avatar>
        )}

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ flexGrow: 1, color: "#fff" }}
        >
          {event.eventType || "Evento Sconosciuto"}
        </Typography>

        <Tooltip title="Dettaglio evento">
          <IconButton onClick={handleGoToEvent}>
            <VisibilityIcon sx={{ color: "#ccc" }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarTodayIcon fontSize="small" sx={{ color: "#ccc" }} />
          <Typography fontSize={14} color="#ccc">
            {new Date(event.completedAt).toLocaleDateString()}
          </Typography>
        </Box>

        {event.winnerId && (
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={handleGoToProfile}
          >
            <EmojiEventsIcon fontSize="small" sx={{ color: "#ccc" }} />
            <Typography
              fontSize={14}
              sx={{ color: "#ccc", textDecoration: "underline" }}
            >
              {winnerName}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default EventParticipationCard;
