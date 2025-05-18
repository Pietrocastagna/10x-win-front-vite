import { useEffect } from "react";
import { getSocket } from "../../utils/socket";
import { useGlobalEvent } from "../../context/GlobalEventContext";
import { useSnackbar } from "notistack";

const normalizeId = (id: any) =>
  typeof id === "object" && id !== null ? id._id : id;

const GlobalSocketListener = () => {
  const { addCompletedEvent } = useGlobalEvent();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const setupSocketListeners = () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const socket = getSocket();

      if (!token || !userId || !socket) {
        console.warn("⚠️ Socket non inizializzato correttamente");
        return;
      }

      // ✅ EVENT: Evento aggiornato
      socket.on("event:update", (instance: any) => {
        console.log("📡 event:update ricevuto:", instance);

        const hasParticipated = instance.participants.some(
          (p: any) => normalizeId(p.userId) === userId
        );
        const didWin = normalizeId(instance.winner) === userId;

        if (instance.status === "completed" && hasParticipated) {
          addCompletedEvent({
            instanceId: instance._id,
            didWin,
            medalImage:
              didWin && instance?.eventType?.medagliaVincita?.image
                ? instance.eventType.medagliaVincita.image
                : "https://cdn-icons-png.flaticon.com/512/3468/3468369.png",
          });
        }
      });

      // ✅ EVENT: Notifica test
      socket.on("notification:test", (payload) => {
        console.log("✅ NOTIFICA DI TEST SOCKET:", payload);
        enqueueSnackbar(payload.message || "Notifica ricevuta", {
          variant: "info",
        });
      });

      // ✅ EVENT: Evento completato
      socket.on("notification:complete-event", (payload) => {
        console.log("📨 Notifica evento completato:", payload);
        enqueueSnackbar(payload.message || "Evento completato", {
          variant: "success",
        });
      });

      // ✅ EVENT: Risposta supporto
      socket.on("support_reply", (data) => {
        console.log("📬 support_reply ricevuta:", data);
        enqueueSnackbar(
          data.message || "Hai ricevuto una risposta dal supporto.",
          {
            variant: "info",
          }
        );
      });
    };

    setupSocketListeners();

    return () => {
      const socket = getSocket();
      if (!socket) return;

      socket.off("event:update");
      socket.off("notification:test");
      socket.off("notification:complete-event");
      socket.off("support_reply");
    };
  }, [addCompletedEvent, enqueueSnackbar]);

  return null;
};

export default GlobalSocketListener;
