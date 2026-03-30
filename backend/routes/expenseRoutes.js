const express = require("express");
const router = express.Router();

const controller = require("../controllers/expenseController");

// 🔥 FIXED
const authenticate = require("../middleware/auth");

router.post("/add", authenticate, controller.addExpense);
router.get("/get", authenticate, controller.getExpenses);
router.delete("/delete/:id", authenticate, controller.deleteExpense);
router.get("/insights", authenticate, controller.getInsights);
router.post("/categorize", authenticate, controller.categorizeExpense);
module.exports = router;