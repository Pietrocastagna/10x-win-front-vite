import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

interface Props {
  pkg: {
    _id: string;
    name: string;
    coinAmount: number;
    priceEUR: number;
  };
  onBuy: () => void;
}

const CoinPackageCard: React.FC<Props> = ({ pkg, onBuy }) => {
  const formatCoin = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <MonetizationOnIcon color="success" />
          <Typography variant="h6">{pkg.name}</Typography>
        </Box>

        <Typography variant="body2" color="gray">
          {formatCoin(pkg.coinAmount)} Coin
        </Typography>

        <Typography variant="h6" color="success.main" mt={1}>
          €{pkg.priceEUR.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={onBuy}
          sx={{ mt: 2 }}
        >
          Acquista
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoinPackageCard;
