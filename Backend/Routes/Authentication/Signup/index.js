const express = require("express");
const router = express.Router();
const {
  JobSeekerSignup,
  EmployerSignup,
} = require("../../../Controllers/Authentication/Signup/SignupController");

// Job Seeker Signup Route
router.post("/jobseeker", JobSeekerSignup);
// Employer Signup Route
router.post("/employer", EmployerSignup);
module.exports = router;
