const crypto = require("crypto");
const { loadEnv } = require("../config/env");

function verifyMetaSignature(req, res, next) {
  const env = loadEnv();
  const signature = req.get("x-hub-signature-256");

  if (!signature || !signature.startsWith("sha256=")) {
    return res.status(403).json({
      success: false,
      message: "Missing Meta webhook signature"
    });
  }

  if (!req.rawBody) {
    return res.status(400).json({
      success: false,
      message: "Raw webhook body is unavailable"
    });
  }

  const received = signature.slice("sha256=".length);
  const expected = crypto
    .createHmac("sha256", env.META_APP_SECRET)
    .update(req.rawBody)
    .digest("hex");

  const receivedBuffer = Buffer.from(received, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return res.status(403).json({
      success: false,
      message: "Invalid Meta webhook signature"
    });
  }

  next();
}

module.exports = { verifyMetaSignature };
