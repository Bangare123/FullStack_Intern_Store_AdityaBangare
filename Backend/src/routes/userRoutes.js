const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getUserStores,  rateStore
} = require("../controllers/userController");

const router = express.Router();


router.get(
  "/stores",
  authenticate,
  authorize("USER"),
  getUserStores
);

router.post(
  "/stores/:storeId/rating",
  authenticate,
  authorize("USER"),
  rateStore
);

module.exports = router;