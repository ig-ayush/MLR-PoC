const { loadEnv } = require("../config/env");
const { asyncHandler } = require("../utils/asyncHandler");
const { processWebhook } = require("../services/metaWebhookService");

function verifyWebhook(req, res) {
  const env = loadEnv();

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === env.META_VERIFY_TOKEN) {
    return res.status(200).send(String(challenge || ""));
  }

  return res.status(403).json({
    success: false,
    message: "Webhook verification failed"
  });
}

const receiveWebhook = asyncHandler(async (req, res) => {
  console.log("[Meta Webhook] received");

  const result = await processWebhook(req.body);

  res.status(200).json({
    success: true,
    message: "Webhook received",
    ...result
  });
});

module.exports = {
  verifyWebhook,
  receiveWebhook
};
