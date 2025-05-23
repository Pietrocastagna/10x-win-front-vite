// 🔁 sostituisce completamente CoinPackageList.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import CoinPackageCard from "./CoinPackageCard";
import AdyenDropIn from "./AdyenDropIn/AdyenDropIn"; // ✅ importa il componente drop-in
import { API_BASE_URL } from "../config";

interface CoinPackage {
  uuid: string;
  name: string;
  coinAmount: number;
  priceEUR: number;
}

const CoinPackageList: React.FC = () => {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(
    null
  );
  const [paymentSession, setPaymentSession] = useState<null | {
    sessionId: string;
    sessionData: string;
    clientKey: string;
  }>(null);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_BASE_URL}/coin-packages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(res.data);
      } catch (err) {
        console.error("Errore fetch pacchetti", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleConfirm = async () => {
    if (!selectedPackage) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API_BASE_URL}/payments/coin`,
        { packageId: selectedPackage.uuid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPaymentSession(res.data);
    } catch (err) {
      console.error("Errore creazione sessione:", err);
      setSnackbarMsg("Errore durante la creazione della sessione.");
    }
  };

  const closeDialog = () => {
    setSelectedPackage(null);
    setPaymentSession(null);
  };

  return (
    <Box mt={4}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {packages.map((pkg) => (
            <Grid item xs={12} sm={6} md={4} key={pkg.uuid}>
              <CoinPackageCard
                pkg={{ ...pkg, _id: pkg.uuid }}
                onBuy={() => setSelectedPackage(pkg)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={!!selectedPackage}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {paymentSession ? `Completa il pagamento` : `Conferma Acquisto`}
        </DialogTitle>
        <DialogContent>
          {paymentSession ? (
            <AdyenDropIn
              sessionId={paymentSession.sessionId}
              sessionData={paymentSession.sessionData}
              clientKey={paymentSession.clientKey}
            />
          ) : (
            <Typography>
              Vuoi acquistare <strong>{selectedPackage?.name}</strong> per{" "}
              <strong>€{selectedPackage?.priceEUR.toFixed(2)}</strong>?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {!paymentSession && (
            <>
              <Button
                onClick={handleConfirm}
                variant="contained"
                color="success"
              >
                Conferma
              </Button>
              <Button onClick={closeDialog} variant="outlined">
                Annulla
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={4000}
        onClose={() => setSnackbarMsg(null)}
        message={snackbarMsg}
      />
    </Box>
  );
};

export default CoinPackageList;
