const express = require("express");
const router = express.Router();

const controller = require("../controllers/leaderboardController");
const authenticate = require("../middleware/auth");

router.get("/", authenticate, controller.getLeaderboard);

module.exports = router;