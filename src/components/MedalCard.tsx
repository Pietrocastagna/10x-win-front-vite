import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

interface Medal {
  _id: string;
  createdAt: string;
  type: string;
  image: string;
  value: number;
  status: string;
  [key: string]: any;
}

interface Props {
  medal: Medal;
  onPressDetail: () => void;
  onAutoClose?: () => void; // ✅ aggiunto per compatibilità con HomeScreen
}

const getBadge = (status: string) => {
  switch (status) {
    case "for_sale":
      return { label: "In vendita", color: "#ff9800" };
    case "used":
      return { label: "Usata", color: "#9c27b0" };
    case "converted":
      return { label: "Convertita", color: "#f44336" };
    case "sold":
      return { label: "Venduta", color: "#607d8b" };
    case "owned":
    default:
      return { label: "Vinta", color: "#4caf50" };
  }
};

const formatNumber = (value: number) => {
  return value.toLocaleString("it-IT");
};

const MedalCard: React.FC<Props> = ({ medal, onPressDetail, onAutoClose }) => {
  const badge = getBadge(medal.status);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // Esempio d'uso opzionale (se vorrai usarlo in futuro)
  // useEffect(() => {
  //   if (onAutoClose) {
  //     const timer = setTimeout(onAutoClose, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [onAutoClose]);

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "#1c1c1e",
        border: "1px solid #333",
        boxShadow: "0 4px 20px rgba(0, 230, 118, 0.2)",
        borderRadius: 2,
        p: 2,
        minWidth: 260,
        maxWidth: 320,
        width: isSmall ? "100%" : "90%",
        m: 1.5,
      }}
    >
      <Avatar
        src={medal.image}
        alt={medal.type}
        sx={{
          width: 60,
          height: 60,
          mr: 2,
          border: "2px solid #00e676",
        }}
      />

      <CardContent sx={{ flex: 1, p: 0 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Typography variant="subtitle2" color="#fff" fontWeight="bold">
            Medaglia da {medal.type}€
          </Typography>
          <IconButton size="small" onClick={onPressDetail}>
            <RemoveRedEyeIcon sx={{ color: "#ccc" }} />
          </IconButton>
        </Box>

        <Chip
          label={badge.label}
          size="small"
          sx={{
            bgcolor: badge.color,
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: "bold",
            mb: 1,
          }}
        />

        <Typography variant="body2" sx={{ color: "#00e676", fontWeight: 600 }}>
          {formatNumber(medal.value)} Coin
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MedalCard;
