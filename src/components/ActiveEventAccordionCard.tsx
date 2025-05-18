import React, { useState } from "react";
import {
  Box,
  Typography,
  Collapse,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
  useTheme,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import TicketIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface Props {
  eventName: string;
  description: string;
  partecipanti: number;
  participantsRequired: number;
  myTickets: number;
  isMegaEvent?: boolean;
  isMulti?: boolean;
  children?: React.ReactNode;
}

const ActiveEventAccordionCard: React.FC<Props> = ({
  eventName,
  description,
  partecipanti,
  participantsRequired,
  myTickets,
  isMulti = false,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);
  const percentage = Math.min((partecipanti / participantsRequired) * 100, 100);

  const getProgressColor = () => {
    if (percentage >= 90) return "#4caf50";
    if (percentage >= 50) return "#ffc107";
    return "#00bcd4";
  };

  const theme = useTheme();

  return (
    <Paper
      elevation={4}
      sx={{
        bgcolor: "#1c1c1e",
        borderRadius: 2,
        p: 2,
        mb: 2,
        border: "1px solid #333",
        boxShadow: "0 4px 12px rgba(0, 230, 118, 0.2)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Header row */}
      <Box display="flex" alignItems="center" mb={1} gap={1}>
        <CalendarMonthIcon sx={{ color: "#ccc", fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 600 }}>
          {eventName}
        </Typography>
        {isMulti && (
          <Chip
            label="MULTI"
            size="small"
            sx={{
              ml: 1,
              bgcolor: "#00e676",
              color: "#000",
              fontSize: 10,
              fontWeight: "bold",
              height: 22,
            }}
          />
        )}
        <Box flexGrow={1} />
        <IconButton onClick={() => setExpanded(!expanded)} size="small">
          {expanded ? (
            <ExpandLessIcon sx={{ color: "#aaa" }} />
          ) : (
            <ExpandMoreIcon sx={{ color: "#aaa" }} />
          )}
        </IconButton>
      </Box>

      {/* Stats row */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <PeopleIcon sx={{ color: "#00e676", fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            {partecipanti}/{participantsRequired}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <TicketIcon sx={{ color: "#00e676", fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            {myTickets} ticket
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#333",
          "& .MuiLinearProgress-bar": {
            backgroundColor: getProgressColor(),
          },
        }}
      />

      {/* Expanded content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box mt={2} pt={2} borderTop="1px solid #333">
          <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
            {description}
          </Typography>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ActiveEventAccordionCard;
