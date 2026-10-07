const http = require("http");
const app = require("./src/app");
const { loadEnv } = require("./src/config/env");
const { testConnection, closePool } = require("./src/database/pool");
const { initializeSocket } = require("./src/websocket/socket");
const { logger } = require("./src/middleware/logger");

const env = loadEnv();
const server = http.createServer(app);

initializeSocket(server);

async function start() {
  try {
    await testConnection();

    server.listen(env.PORT, () => {
      logger.info(`Server started on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down...`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
