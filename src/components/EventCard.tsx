import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface Props {
  event: any;
  onRegistrationToggle: (event: any, isBuyMore?: boolean) => void;
}

const EventCard: React.FC<Props> = ({ event, onRegistrationToggle }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [paymentName, setPaymentName] = useState<string>("");

  useEffect(() => {
    const fetchAssets = async () => {
      const token = localStorage.getItem("authToken");

      try {
        if (event?.medagliaVincita) {
          const res = await axios.get(
            `${API_BASE_URL}/medals-types/${event.medagliaVincita}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setImage(res.data?.image);
          setName(res.data?.type);
        }
        if (event?.trofeoVincita) {
          const res = await axios.get(
            `${API_BASE_URL}/trophy-types/${event.trofeoVincita}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setImage(res.data?.image);
          setName(res.data?.type);
        }

        if (event?.medagliaPagamento) {
          const res = await axios.get(
            `${API_BASE_URL}/medals-types/${event.medagliaPagamento}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPaymentName(res.data?.type);
        }
        if (event?.trophyPagamento) {
          const res = await axios.get(
            `${API_BASE_URL}/trophy-types/${event.trophyPagamento}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPaymentName(res.data?.type);
        }
      } catch (err) {
        console.error("Errore asset:", err);
      }
    };

    fetchAssets();
  }, [
    event?.medagliaVincita,
    event?.trofeoVincita,
    event?.medagliaPagamento,
    event?.trophyPagamento,
  ]);

  const costoBase =
    event?.tipoPagamento === "coin"
      ? `${event?.ticketCost?.toLocaleString()} Coin`
      : event?.tipoPagamento === "medaglia"
      ? `${event?.medalPricePerTicket?.toLocaleString()} da ${paymentName}`
      : event?.tipoPagamento === "coppa"
      ? `${event?.trophyPricePerTicket?.toLocaleString()} da ${paymentName}`
      : "—";

  const canBuyMore =
    event.registered &&
    event.allowMultipleTickets &&
    event.myTickets < event.maxTicketsPerUser;

  const handleDetails = () => {
    navigate(`/app/events/detail/${event.instanceId}`);
  };

  return (
    <Card sx={{ backgroundColor: "#1c1c1e", color: "#fff", borderRadius: 3 }}>
      <CardContent>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            {image ? (
              <Avatar src={image} sx={{ width: 48, height: 48 }} />
            ) : (
              <Avatar sx={{ width: 48, height: 48, bgcolor: "#666" }}>
                N/A
              </Avatar>
            )}
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {event.eventName}{" "}
              {event.allowMultipleTickets && (
                <Chip
                  label="MULTI"
                  size="small"
                  sx={{ ml: 1, bgcolor: "#ff9800", color: "#fff" }}
                />
              )}
            </Typography>
            <Typography variant="body2" color="#aaa">
              {event.description}
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Dettagli evento">
              <IconButton onClick={handleDetails} size="small" color="success">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        {name && (
          <Typography
            variant="body2"
            sx={{ color: "#ccc", mt: 1, textAlign: "center" }}
          >
            {event?.quantitaPremio || 1}x da {name}
          </Typography>
        )}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid #00e676",
            borderRadius: 2,
            p: 1,
            mt: 1.5,
            mb: 2,
            textAlign: "center",
          }}
        >
          <LocalOfferIcon sx={{ color: "#00e676", mr: 1 }} fontSize="small" />
          <Typography fontWeight="600" color="#00e676" fontSize={13}>
            {costoBase}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <PeopleIcon fontSize="small" sx={{ color: "#aaa" }} />
            <Typography fontSize={12} color="#aaa">
              {event.partecipanti}/{event.participantsRequired}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <ConfirmationNumberIcon fontSize="small" sx={{ color: "#aaa" }} />
            <Typography fontSize={12} color="#aaa">
              {event.myTickets}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#00e676", color: "#000" }}
          onClick={() => onRegistrationToggle(event)}
        >
          {event.registered ? "Annulla" : "Iscriviti"}
        </Button>

        {canBuyMore && (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onRegistrationToggle(event, true)}
          >
            Acquista ancora
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default EventCard;
