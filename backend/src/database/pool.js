const mysql = require("mysql2/promise");
const { loadEnv } = require("../config/env");
const { logger } = require("../middleware/logger");

const env = loadEnv();

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true
});

async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    logger.info("Database connected");
  } finally {
    connection.release();
  }
}

async function closePool() {
  await pool.end();
}

module.exports = { pool, testConnection, closePool };
