const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getDashboard,
  createUser,
  getUsers,
  getUserDetails,
  getStoreOwners,
} = require("../controllers/adminController");

const { createStore, getStores } = require("../controllers/storeController");

const router = express.Router();

router.get("/dashboard", authenticate, authorize("ADMIN"), getDashboard);

router.post("/users", authenticate, authorize("ADMIN"), createUser);

router.post("/stores", authenticate, authorize("ADMIN"), createStore);

router.get("/stores", authenticate, authorize("ADMIN"), getStores);

router.get("/users", authenticate, authorize("ADMIN"), getUsers);

router.get("/users/:id", authenticate, authorize("ADMIN"), getUserDetails);

router.get("/owners", authenticate, authorize("ADMIN"), getStoreOwners);

module.exports = router;
