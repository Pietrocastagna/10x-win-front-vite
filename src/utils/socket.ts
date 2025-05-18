import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.warn("❌ Nessun token trovato per autenticazione socket");
    return;
  }

  if (socket && socket.connected) {
    console.log("⚠️ Socket già connesso");
    return;
  }

  socket = io("http://192.168.1.6:5002", {
    transports: ["websocket"],
    autoConnect: false,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Socket connesso:", socket?.id);
    socket?.emit("authenticate", { token });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnesso");
  });
};

export const getSocket = (): Socket | null => socket;
