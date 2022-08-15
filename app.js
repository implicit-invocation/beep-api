const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/beep");

const User = mongoose.model(
  "user",
  {
    username: String,
    password: String,
    verified: Boolean,
  },
  "user"
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
  await User.create({
    username,
    password: hashedPassword,
  });
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

const port = 8080;
app.listen(port, () => console.log("Server started at port", port));
