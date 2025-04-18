const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.comparePasswords = async function (passowrd) {
  return bcrypt.compare(passowrd, this.password);
};

const User = mongoose.model("chat-user", UserSchema);

module.exports = User;
