const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/beep");

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

const Profile = mongoose.model(
  "profile",
  {
    userId: mongoose.Schema.Types.ObjectId,
    displayName: String,
    profilePicture: String,
  },
  "profile"
);

const app = express();

const crypto = require("crypto");
const MD5_SALT = "troicaotrongxanhsuongsomlonglanh";
const JWT_SECRET = "troicaotrongxanhsuongsomlonglanh";
const md5 = (string) =>
  crypto
    .createHash("md5")
    .update(MD5_SALT + string)
    .digest("hex");

const generateToken = (info, secret) => jwt.sign(info, secret);

app.use(bodyParser.json());
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = md5(password);
  try {
    await User.create({
      username,
      password: hashedPassword,
    });
  } catch (e) {
    return res.status(400).send("Duplicated username!");
  }
  res.send("ok");
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: md5(req.body.password),
  });
  if (user) {
    res.send(
      generateToken(
        {
          id: user._id,
        },
        JWT_SECRET
      )
    );
  } else {
    res.status(401).send("Not authorized!");
  }
});

const checkToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return next();
  try {
    const info = jwt.verify(token, JWT_SECRET);
    req.userId = info.id;
    return next();
  } catch (e) {
    res.status(400).send("Invalid token!");
  }
};

app.post("/update-profile", checkToken, async (req, res) => {
  const userId = req.userId;

  // TODO: validation
  await Profile.findOneAndUpdate(
    {
      userId: userId,
    },
    {
      displayName: req.body.displayName,
      profilePicture: req.body.profilePicture,
    },
    {
      upsert: true,
    }
  );

  res.send("Profile updated!");
});

app.get("/me", checkToken, async (req, res) => {
  const userId = req.userId;
  const profile = await Profile.findOne({
    userId,
  });
  res.send(profile);
});

app.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const profile = await Profile.findOne({
    userId,
  });
  res.send(profile);
});

const port = 8080;
app.listen(port, () => console.log("Server started at port", port));
