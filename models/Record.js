const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  Category: { type: String, required: true },
  ClientName: { type: String, required: true },
  ClientRole: { type: String, required: true },
  ClientImage: { type: String, required: true },
});

module.exports = mongoose.model("Record", recordSchema);
