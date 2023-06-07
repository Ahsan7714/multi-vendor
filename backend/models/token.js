const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "2h", // Set token to expire after 2 hours
  },
});

const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = tokenModel;
