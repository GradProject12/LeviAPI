const express = require("express");
const router = express.Router();
const { fileUploadd } = require("../services/upload");

const authController = require("../controllers/auth.controller");

router.post("/signup", fileUploadd("certificate_image"), authController.signup);
router.post("/login", authController.login);
router.post("/verify", authController.verify);
router.post("/send-code", authController.sendCode);
router.post("/forgetpassword", authController.forgetPassword);
router.post("/verifyreset", authController.verifyPasswordReset);
router.post("/resetpassword", authController.resetPassword);
router.post("/change-password/:user_id", authController.changePassword);

module.exports = router;
