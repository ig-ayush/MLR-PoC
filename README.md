# Meta Lead Ads → Node.js → MySQL → Real-Time React Native PoC

A small, reproducible proof of concept for this end-to-end flow:

```text
Meta Lead Form / Lead Testing Tool
              │
              ▼
       Meta leadgen webhook
              │
              ▼
      Node.js + Express
              │
              ▼
       Meta Graph API
              │
              ▼
     normalize + validate
              │
              ▼
            MySQL
              │
              ▼
          Socket.IO
              │
              ▼
      React Native / Expo
              │
              ▼
   New lead appears automatically
```

The React Native Leads screen loads existing leads through REST once, then stays connected to Socket.IO. A genuinely new Meta lead is emitted only after it has been inserted into MySQL.

## Project structure

```text
meta-lead-realtime-poc/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── healthController.js
│   │   │   ├── leadController.js
│   │   │   └── webhookController.js
│   │   ├── database/
│   │   │   ├── leadRepository.js
│   │   │   └── pool.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── logger.js
│   │   │   └── metaSignature.js
│   │   ├── routes/
│   │   │   ├── leadRoutes.js
│   │   │   ├── metaWebhookRoutes.js
│   │   │   └── testRoutes.js
│   │   ├── services/
│   │   │   ├── leadService.js
│   │   │   ├── metaGraphService.js
│   │   │   ├── metaLeadNormalizer.js
│   │   │   └── metaWebhookService.js
│   │   ├── utils/
│   │   │   ├── appError.js
│   │   │   └── asyncHandler.js
│   │   ├── websocket/
│   │   │   └── socket.js
│   │   └── app.js
│   ├── tests/
│   │   ├── health.test.js
│   │   ├── metaLeadNormalizer.test.js
│   │   └── webhookVerification.test.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   │   └── LeadCard.js
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── hooks/
│   │   │   └── useLeads.js
│   │   ├── screens/
│   │   │   └── LeadsScreen.js
│   │   └── services/
│   │       ├── api.js
│   │       └── socket.js
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
├── .gitignore
└── package.json
```

## Technology stack

- React Native
- Expo
- JavaScript only
- React Hooks
- FlatList
- Axios
- Socket.IO client
- Node.js
- Express
- Axios
- Socket.IO
- MySQL 8+
- mysql2
- dotenv
- Meta Lead Ads
- Meta Webhooks
- Meta Graph API
- ngrok
- Postman / curl
- Git / GitHub

## Prerequisites

Install:

- Node.js 20+ recommended
- npm
- MySQL 8+
- Expo CLI through `npx`
- Android emulator or Android phone
- Meta developer account
- A Meta Page and Lead Form available to your developer/test setup
- ngrok

This project targets Expo SDK 57 for the mobile PoC. Expo SDK 57 was released June 30, 2026 and uses React Native 0.86. See the Expo SDK page for the current SDK information.

The default Graph API version is `v26.0`, but it is configurable with `META_API_VERSION`.

## 1. Clone / open the repository

```bash
cd meta-lead-realtime-poc
npm install
```

The root package only provides convenience scripts; backend and mobile have their own dependencies.

## 2. Database setup

Start MySQL and execute:

```bash
mysql -u root -p < database/schema.sql
```

Or open `database/schema.sql` in MySQL Workbench.

The schema creates:

```text
meta_lead_poc
└── leads
    ├── id
    ├── meta_lead_id (UNIQUE)
    ├── name
    ├── email
    ├── phone
    ├── created_at
    └── updated_at
```

The unique `meta_lead_id` is the final duplicate-protection layer.

## 3. Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env`.

Example:

```env
PORT=4000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=meta_lead_poc
DB_USER=root
DB_PASSWORD=your_mysql_password

META_ACCESS_TOKEN=your_page_access_token
META_VERIFY_TOKEN=choose_a_random_verification_string
META_APP_SECRET=your_meta_app_secret
META_API_VERSION=v26.0
META_PAGE_ID=your_page_id

CORS_ORIGIN=*
```

Do not commit `.env`.

Start:

```bash
npm run dev
```

or:

```bash
npm start
```

Expected logs:

```text
Server started on port 4000
Database connected
```

Check:

```text
GET http://localhost:4000/api/health
GET http://localhost:4000/api/leads
```

## 4. Test backend → Socket.IO → mobile before touching Meta

The PoC includes a development-only endpoint:

```text
POST /api/test/leads
```

It creates a clearly marked local test lead, stores it in MySQL, and emits `new-lead` through Socket.IO.

Example:

```bash
curl -X POST http://localhost:4000/api/test/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Socket Test","email":"socket@test.local","phone":"+91 9000000000"}'
```

The route is disabled when `NODE_ENV=production`.

This endpoint does not fake Meta webhooks. It exists only to validate:

```text
Node.js → MySQL → Socket.IO → React Native
```

before the Meta integration is introduced.

## 5. Mobile setup

```bash
cd mobile
cp .env.example .env
npm install
```

### Android emulator

Use:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000
```

Android's emulator maps `10.0.2.2` to the development computer's `localhost`.

### Physical Android phone

Put the computer's LAN IP in the URL:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.50:4000
```

The phone and computer must be able to reach each other over the same network, and the computer firewall must allow the port.

Start:

```bash
npm start
```

Then open the app on the emulator/device.

Open the **Leads** screen. Existing leads should load immediately. The status pill should change to `Connected`.

## 6. Mobile real-time test

Keep the Leads screen open.

Run:

```bash
curl -X POST http://localhost:4000/api/test/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Realtime Employee Test","email":"realtime@test.local","phone":"+91 9000000001"}'
```

Do not touch the mobile app.

The new lead should appear at the top without:

- refreshing
- pressing a button
- reopening the app
- navigating away
- polling

The mobile client listens to:

```text
new-lead
```

## 7. Meta / ngrok setup

Start the backend first.

Expose the backend:

```bash
ngrok http 4000
```

Copy the HTTPS URL. Your webhook callback becomes:

```text
https://YOUR_NGROK_HOST/webhook
```

Do not use an HTTP callback for Meta.

### Meta app configuration

At a high level:

1. Create/select the Meta Developer App.
2. Configure Webhooks for the **Page** object.
3. Subscribe the `leadgen` field.
4. Set the callback URL to:
   `https://YOUR_NGROK_HOST/webhook`
5. Set the same value used by `META_VERIFY_TOKEN`.
6. Complete webhook verification.
7. Subscribe the target Page to the app for `leadgen`.
8. Use a Page access token that can retrieve the leads owned by that Page/form and has the required permissions in your Meta setup.
9. Open the Meta Lead Ads Testing Tool and select your Page/form.

A Page-level subscription is important; configuring the callback at the app level alone is not enough.

### Page subscription example

Use a secure shell/session and do not commit this token:

```bash
curl -X POST \
  "https://graph.facebook.com/v26.0/YOUR_PAGE_ID/subscribed_apps" \
  -d "subscribed_fields=leadgen" \
  -d "access_token=YOUR_PAGE_ACCESS_TOKEN"
```

The exact permissions available to your app depend on the app mode, Page, account, and Meta review requirements. Common lead-retrieval setups use permissions such as:

```text
leads_retrieval
pages_show_list
pages_read_engagement
pages_manage_ads
pages_manage_metadata
```

Check the permissions shown by your Meta Developer dashboard/token rather than copying a stale permission list from an old tutorial.

## 8. Meta webhook verification

Meta calls:

```text
GET /webhook
```

with:

```text
hub.mode
hub.verify_token
hub.challenge
```

The backend:

- accepts the request only when `hub.verify_token` matches `META_VERIFY_TOKEN`
- returns the `hub.challenge`
- returns an error for an invalid token

## 9. Meta POST webhook flow

When Meta posts a leadgen event:

```text
Meta
  ↓
POST /webhook
  ↓
verify x-hub-signature-256
  ↓
extract leadgen_id
  ↓
GET /{leadgen_id}?fields=id,created_time,field_data
  ↓
normalize field_data
  ↓
check meta_lead_id
  ↓
insert into MySQL
  ↓
emit new-lead
  ↓
React Native updates FlatList
```

The webhook payload is treated as a notification. The backend does not assume that the complete form answers are in the webhook itself.

## 10. Meta Lead Testing Tool

Use Meta's Lead Ads Testing Tool.

Typical flow:

1. Choose the connected Page.
2. Choose the Lead Form.
3. Create a test lead.
4. Keep the React Native Leads screen open.
5. Watch the backend logs.
6. Watch the mobile app.

Expected backend flow:

```text
Webhook received
Lead ID detected
Fetching lead from Meta
Lead stored
New lead event emitted
```

Expected mobile result:

```text
Connected
[Newest Lead]
[Older Leads...]
```

The Facebook incubator's lead retrieval checker documents the same overall sequence: subscribe the Page to the `leadgen` field, create a test lead, then read a single lead using its ID; it also notes that only one test lead is kept per form until it is deleted.

If the same test lead is processed twice, the backend must not emit another `new-lead` event and the database must still contain one record.

## 11. Duplicate protection

There are two layers:

### Application layer

Before insertion:

```text
SELECT ... WHERE meta_lead_id = ?
```

If found:

```text
Duplicate lead ignored
```

No new Socket.IO event is emitted.

### Database layer

```sql
UNIQUE(meta_lead_id)
```

The insert code also handles MySQL duplicate-key errors so race conditions cannot create a second record.

## 12. Lead normalization

Meta commonly returns lead answers as an array such as:

```json
{
  "field_data": [
    { "name": "full_name", "values": ["Jane Doe"] },
    { "name": "email", "values": ["jane@example.com"] },
    { "name": "phone_number", "values": ["+91 9000000000"] }
  ]
}
```

The normalization layer maps those answers to:

```json
{
  "metaLeadId": "123456789",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 9000000000"
}
```

Missing optional fields become `null`; the process does not crash.

## 13. API documentation

### GET `/api/health`

Returns:

```json
{
  "success": true,
  "message": "Server is running"
}
```

### GET `/api/leads`

Newest first:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "metaLeadId": "123",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+91 9000000000",
      "createdAt": "2026-10-07T07:00:00.000Z"
    }
  ]
}
```

### GET `/api/leads/:id`

Returns one lead or a `404`.

### GET `/webhook`

Meta verification endpoint.

### POST `/webhook`

Meta leadgen webhook receiver.

### POST `/api/test/leads`

Development-only local socket/database test.

## 14. Socket.IO event

Event:

```text
new-lead
```

Payload:

```json
{
  "id": 1,
  "metaLeadId": "123",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 9000000000",
  "createdAt": "2026-10-07T07:00:00.000Z"
}
```

The backend emits only after the database insert has succeeded.

## 15. Tests

Backend tests are included for:

- health endpoint
- Meta webhook verification
- invalid verification token
- lead normalization

Run:

```bash
cd backend
npm test
```

The most important end-to-end test is still the manual flow:

```text
Meta Test Lead
→ webhook
→ Graph API
→ MySQL
→ Socket.IO
→ mobile
```

## 16. Security notes

- Secrets are environment variables only.
- `.env` files are gitignored.
- Meta access tokens are never returned in API responses.
- Meta access tokens are never written to application logs.
- `x-hub-signature-256` is verified for POST webhook traffic.
- Incoming payload structure is checked before processing.
- SQL uses parameterized queries.
- CORS is configurable.
- The dev test endpoint is disabled in production.
- The mobile app never receives the Meta access token.
- Do not put a Page access token in the Expo/mobile environment.

## 17. Logging

The backend intentionally logs operational events without logging secrets or full lead payloads:

```text
Server started
Database connected
Socket client connected
Webhook received
Lead ID detected
Fetching lead from Meta
Lead stored
Duplicate lead ignored
New lead event emitted
```

## 18. Five-minute demonstration

1. Start MySQL.
2. Start backend.
3. Start ngrok.
4. Configure the Meta webhook once.
5. Start Expo.
6. Open **Leads**.
7. Confirm existing leads load.
8. Confirm the socket status says `Connected`.
9. Open the Meta Lead Ads Testing Tool.
10. Create a test lead.
11. Do not touch the mobile app.
12. Watch the lead appear automatically.

## 19. Current Meta / API notes

The PoC does not hard-code the Graph API version into application logic. It reads:

```env
META_API_VERSION=v26.0
```

from the backend environment.

As of October 7, 2026, Meta's public Graph API changelog lists `v26.0` as the current Graph API release. The version was released July 29, 2026. Keep the environment override so you can move versions without editing source code.

Meta's own Facebook Incubator lead-retrieval checker documents the important webhook setup pieces for this flow: app-level Page/`leadgen` subscription, Page-level subscription, the `leadgen_id` webhook value, and retrieving the actual lead through the Graph API.

## 20. Assumptions

- This is a PoC, not a production CRM.
- Authentication/user management is intentionally omitted.
- There is one MySQL database.
- There is one backend process.
- Socket.IO uses the same HTTP server as Express.
- A Page access token with suitable lead retrieval permissions is supplied through `META_ACCESS_TOKEN`.
- Meta's current dashboard may ask for additional permissions/review depending on the app and mode.
- Test lead behavior can differ from a production ad lead.
- The app is expected to run in development on an Android emulator or physical Android device.
