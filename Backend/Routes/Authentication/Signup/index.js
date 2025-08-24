const express = require("express");
const router = express.Router();
const {
  JobSeekerSignup,
  EmployerSignup,
} = require("../../../Controllers/Authentication/Signup/SignupController");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // limit each IP to 5 requests per windowMs
  message: {
    ok: false,
    error:
      "Too many requests. Please try again later. You Have Limit To Create Account, 3 Request per Minute",
  },
  headers: true, // send rate limit info in headers
});
// Job Seeker Signup Route
router.post("/jobseeker", limiter, JobSeekerSignup);
// Employer Signup Route
router.post("/employer", limiter, EmployerSignup);
module.exports = router;
