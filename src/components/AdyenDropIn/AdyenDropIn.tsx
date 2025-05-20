import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { useEffect } from "react";

interface Props {
  sessionId: string;
  sessionData: string;
  clientKey: string;
  onComplete?: (result: any) => void;
  onError?: (error: any) => void;
}

const AdyenDropIn: React.FC<Props> = ({
  sessionId,
  sessionData,
  clientKey,
  onComplete,
  onError,
}) => {
  useEffect(() => {
    if (!sessionId || !sessionData || !clientKey) return;
    if (document.getElementById("adyen-initialized")) return;

    const container = document.createElement("div");
    container.id = "adyen-initialized";
    document.getElementById("dropin-container")?.appendChild(container);

    const setupAdyen = async () => {
      try {
        const checkout = await AdyenCheckout({
          environment: "test",
          clientKey,
          session: {
            id: sessionId,
            sessionData,
          },
          paymentMethodsConfiguration: {
            card: {
              hasHolderName: true,
              holderNameRequired: true,
              billingAddressRequired: false,
            },
          },
          onPaymentCompleted: (res) => {
            console.log("✅ Pagamento completato:", res);
            onComplete?.(res);
          },
          onError: (err) => {
            console.error("❌ Errore pagamento:", err);
            onError?.(err);
          },
        });

        checkout.create("dropin").mount("#adyen-initialized");
      } catch (error) {
        console.error("❌ Errore inizializzazione Adyen:", error);
        onError?.(error);
      }
    };

    setupAdyen();
  }, [sessionId, sessionData, clientKey, onComplete, onError]);

  return <div id="dropin-container" />;
};

export default AdyenDropIn;
