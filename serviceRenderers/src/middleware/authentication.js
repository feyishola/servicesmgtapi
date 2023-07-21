const jwt = require("jsonwebtoken");
require("dotenv").config();

function Authentication(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    try {
      const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);

      req.user = verifiedToken;
    } catch (error) {
      return res.status(403).json({ response: "Invalid token!!!" });
    }
  } else {
    return res
      .status(400)
      .json({ response: "Token is required for authentication" });
  }
  return next();
}

module.exports = Authentication;
