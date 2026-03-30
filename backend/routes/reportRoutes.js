const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

// 🔥 IMPORTANT FIX
const authenticate = require("../middleware/auth");

// DEBUG (temporary)
console.log("auth:", typeof authenticate);
console.log("download:", typeof reportController.downloadReport);

router.get("/download", authenticate, reportController.downloadReport);

module.exports = router;