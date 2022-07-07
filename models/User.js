const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 5,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  role: {
    type: String,
    default: "USER",
  },
  picture: String,
  fullName: String,
  dateOfBirth: Date,
  gender: String,
  phoneNumber: Number,
  wishlist: [String],
  pin: Number,
});

module.exports = mongoose.model("User", UserSchema);
