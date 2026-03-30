const express = require("express");
const router = express.Router();

const controller = require("../controllers/purchaseController");
const authenticate = require("../middleware/auth");

// 🔥 MUST MATCH FRONTEND
router.get("/premium", authenticate, controller.buyPremium);
router.post("/update-status", authenticate, controller.updateStatus);
console.log("🔥 purchaseRoutes loaded");
module.exports = router;