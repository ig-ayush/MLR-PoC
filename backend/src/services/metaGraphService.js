const axios = require("axios");
const { loadEnv } = require("../config/env");
const { logger } = require("../middleware/logger");

async function fetchLeadById(leadId) {
  const env = loadEnv();

  if (!env.META_ACCESS_TOKEN) {
    throw new Error("META_ACCESS_TOKEN is not configured");
  }

  const url = `https://graph.facebook.com/${env.META_API_VERSION}/${encodeURIComponent(leadId)}`;

  try {
    const response = await axios.get(url, {
      params: {
        fields: "id,created_time,field_data",
        access_token: env.META_ACCESS_TOKEN
      },
      timeout: 15000
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const metaMessage = error.response?.data?.error?.message;

    logger.error(
      `Meta Graph API lead fetch failed${status ? ` (${status})` : ""}: ${
        metaMessage || error.message
      }`
    );

    const safeMessage =
      status === 401 || status === 403
        ? "Meta access token is invalid, expired, or not authorized for this lead"
        : metaMessage || "Meta Graph API request failed";

    const wrapped = new Error(safeMessage);
    wrapped.statusCode = status === 404 ? 502 : status || 502;
    throw wrapped;
  }
}

module.exports = { fetchLeadById };
