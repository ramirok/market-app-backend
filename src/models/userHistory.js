const mongoose = require("mongoose");

const userHistorySchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
  owner: { type: mongoose.Types.ObjectId, required: true },
});

const UserHistory = mongoose.model("UserHistory", userHistorySchema);

module.exports = UserHistory;
