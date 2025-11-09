const mongoose = require('mongoose')

const AutorSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
});

const openDataSchema = new mongoose.Schema({
  datum: { type: Date, required: true },
  link_reddit: { type: String, required: true },
  korisnik: { type: String, required: true },
  broj_upvote: { type: Number, default: 0 },
  knjiga: { type: String, required: true },
  ISBN10: { type: String },
  autori: { type: [AutorSchema], default: [] },
  područje: { type: [String], default: [] },
  potpodručje: { type: [String], default: [] },
  link_amazon: { type: String },
  ocjena_amazon: { type: Number },
})

module.exports = mongoose.model("Data", openDataSchema, "knjige")