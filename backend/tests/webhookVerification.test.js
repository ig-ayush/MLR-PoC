process.env.NODE_ENV = "test";
process.env.DB_HOST = "127.0.0.1";
process.env.DB_PORT = "3306";
process.env.DB_NAME = "meta_lead_poc";
process.env.DB_USER = "root";
process.env.META_ACCESS_TOKEN = "test-token";
process.env.META_VERIFY_TOKEN = "verify-token";
process.env.META_APP_SECRET = "test-secret";
process.env.META_PAGE_ID = "page-1";

const request = require("supertest");
const app = require("../src/app");

describe("GET /webhook", () => {
  test("returns the Meta challenge for a valid token", async () => {
    const response = await request(app).get(
      "/webhook?hub.mode=subscribe&hub.verify_token=verify-token&hub.challenge=abc123"
    );

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("abc123");
  });

  test("rejects an invalid token", async () => {
    const response = await request(app).get(
      "/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123"
    );

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
