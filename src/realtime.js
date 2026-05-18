import { io } from "socket.io-client";
import { API_ORIGIN } from "./api";

export const connectRealtime = ({ onOrderCreated, onOrderStatusUpdated, onProductChanged }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const socket = io(API_ORIGIN, {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  socket.on("order:created", (order) => {
    onOrderCreated?.(order);
  });

  socket.on("order:status_updated", (order) => {
    onOrderStatusUpdated?.(order);
  });

  socket.on("product:changed", (product) => {
    onProductChanged?.(product);
  });

  socket.on("connect_error", (err) => {
    console.error("Realtime connection failed", err.message);
  });

  return socket;
};
