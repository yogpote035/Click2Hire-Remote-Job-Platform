const express = require("express");
const router = express.Router();
const {
  LoginWithMobileAndPassword,
  LoginWithEmailAndPassword,
  LoginEmailWithOtp,
  SentOtp,
} = require("../../../Controllers/Authentication/Login/LoginController");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // limit each IP to 5 requests per windowMs
  message: {
    ok: false,
    error:
      "Too many requests. Please try again later. You Have Limit: 3 Request per Minute",
  },
  headers: true, // send rate limit info in headers
});
router.post("/mobile-password", limiter, LoginWithMobileAndPassword);
router.post("/email-password", limiter, LoginWithEmailAndPassword);
router.post("/send-otp", limiter, SentOtp);
router.post("/verify-otp", limiter, LoginEmailWithOtp);

module.exports = router;
