const mongoose = require("mongoose");

const User = mongoose.model(
  "user",
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    verified: Boolean,
  },
  "user"
);

module.exports = User;
