const jwt = require("jsonwebtoken");
const errorHandler = require("./err");
require("dotenv").config();

function verifyToken(req, res, next) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, "Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = { verifyToken };
