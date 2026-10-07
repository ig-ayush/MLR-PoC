const dotenv = require("dotenv");

let loaded = false;
let cachedEnv = null;

function loadEnv() {
  if (loaded) return cachedEnv;

  dotenv.config();

  const required = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "META_ACCESS_TOKEN",
    "META_VERIFY_TOKEN",
    "META_APP_SECRET",
    "META_PAGE_ID"
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV !== "test") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  cachedEnv = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT || 4000),

    DB_HOST: process.env.DB_HOST || "127.0.0.1",
    DB_PORT: Number(process.env.DB_PORT || 3306),
    DB_NAME: process.env.DB_NAME || "meta_lead_poc",
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "",

    META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || "",
    META_VERIFY_TOKEN: process.env.META_VERIFY_TOKEN || "",
    META_APP_SECRET: process.env.META_APP_SECRET || "",
    META_API_VERSION: process.env.META_API_VERSION || "v26.0",
    META_PAGE_ID: process.env.META_PAGE_ID || "",

    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    ENABLE_TEST_ROUTES: String(process.env.ENABLE_TEST_ROUTES || "false").toLowerCase() === "true"
  };

  loaded = true;
  return cachedEnv;
}

module.exports = { loadEnv };
