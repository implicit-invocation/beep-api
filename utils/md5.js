const crypto = require("crypto");
const MD5_SALT = "troicaotrongxanhsuongsomlonglanh";

const md5 = (string) =>
  crypto
    .createHash("md5")
    .update(MD5_SALT + string)
    .digest("hex");

module.exports = md5;
