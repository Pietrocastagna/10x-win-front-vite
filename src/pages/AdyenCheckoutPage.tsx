import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";

const AdyenCheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const sessionId = query.get("sessionId");
  const sessionData = query.get("sessionData");
  const clientKey =
    query.get("clientKey") || import.meta.env.VITE_ADYEN_CLIENT_KEY!;

  useEffect(() => {
    const loadCheckout = async () => {
      if (!sessionId || !sessionData || !clientKey) {
        console.warn("⚠️ Parametri Adyen mancanti.");
        navigate("/payment-failed");
        return;
      }

      try {
        const checkout = await AdyenCheckout({
          environment: "test",
          clientKey,
          session: {
            id: sessionId,
            sessionData,
          },
          showPayButton: true,
          onPaymentCompleted: (result) => {
            console.log("✅ Pagamento completato:", result);
            navigate("/payment-success");
          },
          onError: (error) => {
            console.error("❌ Errore Adyen:", error);
            navigate("/payment-failed");
          },
        });

        checkout.create("dropin").mount("#adyen-container");
      } catch (err) {
        console.error("❌ Errore caricamento Adyen Checkout:", err);
        navigate("/payment-failed");
      }
    };

    loadCheckout();
  }, [sessionId, sessionData, clientKey, navigate]);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Completa il pagamento</h2>
      <div id="adyen-container" style={styles.container} />
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "2rem",
    backgroundColor: "#121212",
    color: "#ffffff",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
  container: {
    maxWidth: 420,
    margin: "0 auto",
    backgroundColor: "#1e1e1e",
    padding: "1.5rem",
    borderRadius: "10px",
  },
};

export default AdyenCheckoutPage;
