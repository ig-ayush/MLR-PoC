const { Server } = require("socket.io");
const { loadEnv } = require("../config/env");
const { logger } = require("../middleware/logger");

let io = null;

function initializeSocket(httpServer) {
  const env = loadEnv();

  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    logger.info(`Socket client connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      logger.info(`Socket client disconnected: ${socket.id} (${reason})`);
    });

    socket.on("error", (error) => {
      logger.warn(`Socket client error: ${socket.id} (${error?.message || "unknown"})`);
    });
  });

  return io;
}

function emitNewLead(lead) {
  if (!io) {
    logger.warn("Socket.IO is not initialized; new lead event was not emitted");
    return;
  }

  io.emit("new-lead", lead);
}

function getIO() {
  return io;
}

module.exports = {
  initializeSocket,
  emitNewLead,
  getIO
};
