// 📁 src/components/AdyenDropIn/AdyenDropIn.tsx

import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { useEffect } from "react";

interface Props {
  sessionId: string;
  sessionData: string;
  clientKey: string;
}

const AdyenDropIn: React.FC<Props> = ({
  sessionId,
  sessionData,
  clientKey,
}) => {
  useEffect(() => {
    const setupAdyen = async () => {
      try {
        const checkout = await AdyenCheckout({
          environment: "test", // ✅ necessario per evitare l'errore
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
          },
          onError: (err) => {
            console.error("❌ Errore pagamento:", err);
          },
        });

        checkout.create("dropin").mount("#dropin-container");
      } catch (error) {
        console.error(
          "❌ Errore durante l'inizializzazione di AdyenCheckout:",
          error
        );
      }
    };

    setupAdyen();
  }, [sessionId, sessionData, clientKey]);

  return <div id="dropin-container" />;
};

export default AdyenDropIn;
