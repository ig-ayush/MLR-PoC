# Mobile

React Native / Expo employee lead inbox.

## Run

```bash
cp .env.example .env
npm install
npm start
```

Keep the Leads screen open.

The app:

1. GETs `/api/leads` for initial state.
2. Connects to Socket.IO.
3. Listens for `new-lead`.
4. Prepends a new lead to the FlatList without refreshing.

## Base URL

Android emulator:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000
```

Physical phone:

```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_COMPUTER_LAN_IP:4000
```

Do not put Meta secrets or access tokens in this `.env`.
