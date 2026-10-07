const express = require("express");
const cors = require("cors");
const { loadEnv } = require("./config/env");
const { requestLogger } = require("./middleware/logger");
const healthRoutes = require("./routes/healthRoutes");
const leadRoutes = require("./routes/leadRoutes");
const metaWebhookRoutes = require("./routes/metaWebhookRoutes");
const testRoutes = require("./routes/testRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const env = loadEnv();

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN
  })
);

app.use(
  express.json({
    limit: "1mb",
    verify(req, res, buffer) {
      req.rawBody = Buffer.from(buffer);
    }
  })
);

app.use(requestLogger);

app.use("/api/health", healthRoutes);
app.use("/api/leads", leadRoutes);
app.use("/webhook", metaWebhookRoutes);
app.use("/api/test", testRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
