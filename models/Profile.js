const mongoose = require("mongoose");

const Profile = mongoose.model(
  "profile",
  {
    userId: mongoose.Schema.Types.ObjectId,
    displayName: String,
    profilePicture: String,
  },
  "profile"
);

module.exports = Profile;
