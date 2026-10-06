const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

function Authentication(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ response: false, payload: "Please sign in to continue" });
  }

  try {
    req.user = jwt.verify(token, secretKey);
  } catch {
    return res.status(401).json({ response: false, payload: "Your session has expired. Please sign in again" });
  }
  return next();
}

module.exports = Authentication;
