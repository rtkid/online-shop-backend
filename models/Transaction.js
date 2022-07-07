const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  plantIds: {
    type: [String],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
