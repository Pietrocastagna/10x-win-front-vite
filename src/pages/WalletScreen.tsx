import React, { useState } from "react";
import { Box, Typography, ToggleButton, CircularProgress } from "@mui/material";
import WithdrawalAccordionList from "../components/WithdrawalAccordionList";
import CoinPackageList from "../components/CoinPackageList";

const WalletScreen = () => {
  const [activeTab, setActiveTab] = useState<
    "coin" | "withdrawals" | "history"
  >("coin");

  const renderContent = () => {
    switch (activeTab) {
      case "coin":
        return <CoinPackageList />;
      case "withdrawals":
        return <WithdrawalAccordionList />;
      case "history":
        return (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={4}
          >
            Storico transazioni Coin (in arrivo)
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: "#121212", minHeight: "100vh", py: 3, px: 2 }}>
      <Typography
        variant="h5"
        color="#00e676"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Wallet
      </Typography>

      <Box sx={{ display: "flex", mb: 2 }}>
        <ToggleButton
          value="coin"
          selected={activeTab === "coin"}
          onClick={() => setActiveTab("coin")}
          sx={{
            flex: 1,
            borderColor: activeTab === "coin" ? "#00e676" : "transparent",
            color: activeTab === "coin" ? "#00e676" : "#fff",
            bgcolor: "#1e1e1e",
            borderRadius: 0,
          }}
        >
          Acquista Coin
        </ToggleButton>
        <ToggleButton
          value="withdrawals"
          selected={activeTab === "withdrawals"}
          onClick={() => setActiveTab("withdrawals")}
          sx={{
            flex: 1,
            borderColor:
              activeTab === "withdrawals" ? "#00e676" : "transparent",
            color: activeTab === "withdrawals" ? "#00e676" : "#fff",
            bgcolor: "#1e1e1e",
            borderRadius: 0,
          }}
        >
          Stato vendite
        </ToggleButton>
        <ToggleButton
          value="history"
          selected={activeTab === "history"}
          onClick={() => setActiveTab("history")}
          sx={{
            flex: 1,
            borderColor: activeTab === "history" ? "#00e676" : "transparent",
            color: activeTab === "history" ? "#00e676" : "#fff",
            bgcolor: "#1e1e1e",
            borderRadius: 0,
          }}
        >
          Transazioni
        </ToggleButton>
      </Box>

      <Box sx={{ backgroundColor: "#1e1e1e", borderRadius: 2, p: 2 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default WalletScreen;
