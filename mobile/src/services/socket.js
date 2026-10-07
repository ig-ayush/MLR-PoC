import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/env";

export function createLeadsSocket() {
  return io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000
  });
}
