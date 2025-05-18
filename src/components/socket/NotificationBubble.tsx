import React, { useEffect, useState, useCallback } from "react";
import {
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../utils/socket";

const API_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/notifications/complete-event`;

const NotificationBubble = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());

  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Errore fetch notifiche:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const listener = (payload: any) => {
      console.log("📨 Ricevuta notifica evento completato:", payload);
      setRefreshTrigger(Date.now());
    };

    socket.on("notification:complete-event", listener);

    return () => {
      socket.off("notification:complete-event", listener);
    };
  }, []);

  const handleViewNotification = async (notifId: string, eventId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await axios.delete(`${API_URL}/${notifId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) => prev.filter((n) => n._id !== notifId));

      setOpen(false);
      navigate(`/app/events/animation/${eventId}`);
    } catch (err) {
      alert("Errore apertura notifica");
    }
  };

  if (notifications.length === 0) return null;

  return (
    <>
      <Badge
        badgeContent={notifications.length}
        color="error"
        sx={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 2000,
        }}
      >
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ bgcolor: "#000", border: "2px solid #fff", color: "#fff" }}
        >
          <EmojiEventsIcon />
        </IconButton>
      </Badge>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Eventi Completati</DialogTitle>
        <DialogContent dividers>
          <List>
            {notifications.map((notif) => (
              <ListItem disablePadding key={notif._id}>
                <ListItemButton
                  onClick={() =>
                    handleViewNotification(notif._id, notif.eventId)
                  }
                >
                  <ListItemText
                    primary={`🎯 Evento #${String(notif.eventId).slice(-5)}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationBubble;
