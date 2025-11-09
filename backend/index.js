const db = require("./DataScheme");

const express = require("express");
const app = express();
const port = 3000;
app.listen(port);

const cors = require("cors");
app.use(cors({ origin: "*" })); //nesigurno, za razvoj
// http://127.0.0.1:5500

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/redditKnjige");

async function queryDatabaseField(field, queryString) {
  const regex = new RegExp(queryString, "i");
  const data = await db.where(field).equals(regex);
  return data;
}

async function queryDatabaseAllFields(queryString) {
  const regex = new RegExp(queryString, "i");
  const data = await db.find({
    $or: [
      { link_reddit: regex },
      { korisnik: regex },
      { knjiga: regex },
      { ISBN10: regex },
      { "autori.ime": regex },
      { "autori.prezime": regex },
      { područje: regex },
      { potpodručje: regex },
      { link_amazon: regex },
    ],
  });
  return data;
}

async function queryAll() {
  const data = await db.find();
  return data;
}

app.get("/:field/:queryString", async (req, res) => {
  if (req.params.field.toString().toLowerCase() == "allfields") {
    queryDatabaseAllFields(req.params.queryString)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  } else {
    queryDatabaseField(req.params.field, req.params.queryString)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  }
});

app.get("/all", async (req, res) => {
  queryAll()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});
