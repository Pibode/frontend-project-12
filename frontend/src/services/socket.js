// frontend/src/services/socket.js
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket?.connected) return this.socket;

    // Используем текущий origin для подключения (работает и в dev, и в prod)
    this.socket = io({
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected", this.socket.id);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // Делаем сокет доступным глобально для отладки (только в dev режиме)
    if (process.env.NODE_ENV === "development") {
      window.socketService = this;
      window.socket = this.socket;
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

const socketService = new SocketService();
export default socketService;
