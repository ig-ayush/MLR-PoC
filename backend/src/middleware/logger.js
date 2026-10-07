function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info(message) {
    console.log(`[${timestamp()}] INFO  ${message}`);
  },
  warn(message) {
    console.warn(`[${timestamp()}] WARN  ${message}`);
  },
  error(message) {
    console.error(`[${timestamp()}] ERROR ${message}`);
  }
};

function requestLogger(req, res, next) {
  const started = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - started;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  next();
}

module.exports = { logger, requestLogger };
