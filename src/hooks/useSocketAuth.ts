import { useEffect } from "react";
import { initSocket, getSocket } from "../utils/socket";

export const useSocketAuth = () => {
  useEffect(() => {
    let initialized = false;

    const connect = async () => {
      try {
        await initSocket();
        initialized = true;
      } catch (err) {
        console.error("❌ Errore in initSocket:", err);
      }
    };

    connect();

    return () => {
      if (initialized) {
        const socket = getSocket();
        if (socket && typeof socket.disconnect === "function") {
          socket.disconnect();
        }
      }
    };
  }, []);
};
