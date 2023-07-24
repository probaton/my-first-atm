# My First ATM
A small React app that mimics an ATM. The app talks to an Express stub that mimics a bank with a single user (account number 1234567890, PIN 4242). Possible interactions include authentication, checking balance, and withdrawing funds. 

## Getting Started
Install dependencies
```
npm install
```

Run back-end on port 3001
```
npm run start-server
```

Run client (in a new terminal)
```
npm run start-client
```

Once run successfully, the app can be accessed at `http://localhost:3000`. To start an interaction, simply click the card reader. This will "insert" the only card currently supported by the app. The card's PIN is 4242. 

## Server
All server code can be found in `src/server`. All data is read and written from `src/server/db.json`, which is re-seeded from `src/server.dbSeed.json` every time it is kicked off.

### Supported requests:
`POST /auth`: check user PIN/account number
`GET /balance`: check user's current balance
`PUT /balance`: withdraw amount
