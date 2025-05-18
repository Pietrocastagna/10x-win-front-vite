// 📁 src/pages/AdyenCheckoutPage.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as AdyenWeb from "@adyen/adyen-web"; // ✅ Import corretto per Adyen
import "@adyen/adyen-web/dist/adyen.css";

const AdyenCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const sessionId = query.get("sessionId");
  const sessionData = query.get("sessionData");

  useEffect(() => {
    const loadCheckout = async () => {
      if (!sessionId || !sessionData) return;

      try {
        // ✅ Fix TypeScript: utilizza 'as any' per bypassare il problema con 'new'
        const checkout: any = await new (AdyenWeb as any).AdyenCheckout({
          environment: "test",
          clientKey: import.meta.env.VITE_ADYEN_CLIENT_KEY!,
          session: {
            id: sessionId,
            sessionData,
          },
          showPayButton: true,
          onPaymentCompleted: (result: any, component: any) => {
            console.log("✅ Pagamento completato:", result);
            navigate("/payment-success");
          },
          onError: (error: any, component: any) => {
            console.error("❌ Errore Adyen:", error);
            navigate("/payment-failed");
          },
        });

        checkout.create("dropin").mount("#adyen-container");
      } catch (err) {
        console.error("Errore caricamento Adyen:", err);
      }
    };

    loadCheckout();
  }, [sessionId, sessionData, navigate]);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Pagamento</h2>
      <div id="adyen-container" style={styles.container} />
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "2rem",
    backgroundColor: "#121212",
    color: "#fff",
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
