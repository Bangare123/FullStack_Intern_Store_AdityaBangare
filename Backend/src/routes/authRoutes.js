const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const {
  register,
  login,
  updatePassword,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.put("/update-password", authenticate, updatePassword);

module.exports = router;
