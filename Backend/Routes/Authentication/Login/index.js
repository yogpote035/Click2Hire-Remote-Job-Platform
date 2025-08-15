const express = require("express");
const router = express.Router();
const {
  LoginWithMobileAndPassword,
  LoginWithEmailAndPassword,
  LoginEmailWithOtp,
  SentOtp,
} = require("../../../Controllers/Authentication/Login/LoginController");
router.post("/mobile-password", LoginWithMobileAndPassword);
router.post("/email-password", LoginWithEmailAndPassword);
router.post("/send-otp", SentOtp);
router.post("/verify-otp", LoginEmailWithOtp);

module.exports = router;