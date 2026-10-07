# Backend

Node.js + Express + MySQL + Socket.IO backend for the Meta Lead Ads real-time PoC.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

The server listens on `PORT` from `.env`.

## Important endpoints

- `GET /api/health`
- `GET /api/leads`
- `GET /api/leads/:id`
- `GET /webhook`
- `POST /webhook`
- `POST /api/test/leads` (development only)

## Real-time event

The server emits:

```text
new-lead
```

only after a new lead has been inserted into MySQL.

## Meta signature

`POST /webhook` verifies the `x-hub-signature-256` header using `META_APP_SECRET`.

Do not disable signature verification for real Meta traffic.
