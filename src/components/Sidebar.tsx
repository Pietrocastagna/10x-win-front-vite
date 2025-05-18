// 📁 src/components/Sidebar.tsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { ExpandLess, ExpandMore, Menu, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sidebarItems, SidebarItem } from "./SidebarItems";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNavigate = (route?: string, isLogout = false) => {
    if (isLogout) {
      setLogoutVisible(true);
      return;
    }
    if (route) {
      navigate(route);
      setOpen(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutVisible(false);
    await logout();
    navigate("/login");
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          bgcolor: "#121212",
          border: "1px solid #00bcd4",
        }}
      >
        {open ? (
          <Close sx={{ color: "#00bcd4" }} />
        ) : (
          <Menu sx={{ color: "#00bcd4" }} />
        )}
      </IconButton>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "#121212",
            color: "#fff",
            pt: 4,
          },
        }}
      >
        <Box px={2}>
          <Typography variant="h6" sx={{ color: "#00bcd4", mb: 2 }}>
            Menu
          </Typography>
        </Box>

        <Divider />

        <List disablePadding>
          {sidebarItems.map((section) => (
            <Box key={section.key}>
              <ListItem button onClick={() => toggleSection(section.key)}>
                <ListItemIcon sx={{ color: "#00bcd4" }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText primary={section.label} />
                {expandedSections[section.key] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItem>

              <Collapse
                in={expandedSections[section.key]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {section.items.map((item: SidebarItem) => (
                    <ListItem
                      button
                      key={item.label}
                      sx={{ pl: 4 }}
                      onClick={() =>
                        handleNavigate(
                          "route" in item ? item.route : undefined,
                          item.label === "Esci dall'account"
                        )
                      }
                    >
                      {item.icon && (
                        <ListItemIcon sx={{ color: "#ccc" }}>
                          {item.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Drawer>

      <Dialog open={logoutVisible} onClose={() => setLogoutVisible(false)}>
        <DialogTitle>Sei sicuro di voler uscire?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setLogoutVisible(false)} color="inherit">
            Annulla
          </Button>
          <Button onClick={handleLogoutConfirm} color="error">
            Esci
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
