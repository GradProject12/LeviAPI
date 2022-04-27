const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify", authController.verify);
router.post("/send-code", authController.sendCode);
router.post("/forgetpassword", authController.forgetPassword);
router.post("/verifyreset", authController.verifyPasswordReset);
router.post("/resetpassword", authController.resetPassword);

module.exports = router;
