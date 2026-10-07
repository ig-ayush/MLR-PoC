# Meta Ads React Native App

A simple React Native application built as a proof of concept for working with Meta Ads-related functionality.

## Tech Stack

- React Native
- JavaScript
- Node.js
- Express.js
- Meta Ads API

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