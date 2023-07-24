const { readFileSync, writeFileSync } = require("fs");
const express = require("express");
const cors = require("cors");

const dbPath = "src/server/db.json";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;
app.listen(port, () => {
  console.log(`ATM server listening on port ${port}`);
});

app.post("/auth", (req, res) => {
  res.send({ success: !!(getAuthenticatedUser(req)) });
});

app.get("/balance", (req, res) => {
  const user = getAuthenticatedUser(req);
  res.send({ balance: user?.balance || "0" });
});

app.put("/balance", (req, res) => {
  const user = getAuthenticatedUser(req);
  const amount = req.body?.amount;

  if (!amount) {
    return res.send({ success: false, message: "No amount specified", balance: user.balance });
  }

  if (amount > user?.balance) {
    return res.send({ success: false, message: "Insufficient funds", balance: user.balance });
  }

  const updatedDb = getDb();
  updatedDb.users[req.query.accountNr].balance = Math.round((user.balance - amount) * 100) / 100;
  writeFileSync(dbPath, JSON.stringify(updatedDb));
  res.send({ success: true, balance: getAuthenticatedUser(req).balance });
});

// Returns the user if they pass authentication or undefined if not
function getAuthenticatedUser(req) {
  const query = req.query;
  if (!query?.pin || !query?.accountNr) {
    return undefined;
  }
  const user = getDb().users[query.accountNr];
  return user?.pin === query.pin
    ? user
    : undefined;
}

function getDb() {
  const dbFile = readFileSync(dbPath);
  return JSON.parse(dbFile);
}
