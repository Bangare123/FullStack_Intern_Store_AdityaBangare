const { verifyToken } = require("../utils/token");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid authorization format"
    });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

  req.user = user;

  next();
}

module.exports = authenticate;