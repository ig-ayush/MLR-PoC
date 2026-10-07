function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  console.error(err);

  const status = Number(err.statusCode || err.status || 500);

  res.status(status).json({
    success: false,
    message:
      status >= 500
        ? "An unexpected server error occurred"
        : err.message || "Request failed"
  });
}

module.exports = { notFoundHandler, errorHandler };
