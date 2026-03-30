const express = require("express");
const router = express.Router();

const controller = require("../controllers/passwordController");

router.post("/forgotpassword", controller.forgotPassword);
router.get("/resetpassword/:id", controller.resetPasswordPage);
router.post("/updatepassword/:id", controller.updatePassword);

module.exports = router;