// 📁 src/pages/Wallet/CoinPurchasePage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdyenDropIn from "../../components/AdyenDropIn/AdyenDropIn";

const CoinPurchasePage = () => {
  const [sessionInfo, setSessionInfo] = useState<null | {
    sessionId: string;
    sessionData: string;
    clientKey: string;
  }>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.post(
          "/api/payments/coin-session",
          {
            packageId: "ID_PACCHETTO_SELEZIONATO",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSessionInfo(res.data);
      } catch (err) {
        console.error("Errore nella creazione della sessione Adyen:", err);
      }
    };

    fetchSession();
  }, []);

  return (
    <div>
      <h2>Acquisto Coin</h2>
      {sessionInfo ? (
        <AdyenDropIn
          sessionId={sessionInfo.sessionId}
          sessionData={sessionInfo.sessionData}
          clientKey={sessionInfo.clientKey}
        />
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
};

export default CoinPurchasePage;
