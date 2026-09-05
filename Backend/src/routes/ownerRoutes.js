const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getOwnerDashboard
} = require("../controllers/ownerController");

const router = express.Router();


router.get(
  "/dashboard",
  authenticate,
  authorize("OWNER"),
  getOwnerDashboard
);

module.exports = router;