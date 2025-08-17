// routes/jobApplicationRoutes.js
const express = require("express");
const router = express.Router();
const jobApplicationController = require("../../Controllers/Job/JobApplyingController");
const VerifyToken = require("../../Middleware/VerifyToken");

// Apply for a job
router.post("/apply", VerifyToken, jobApplicationController.applyForJob);

// Get all applications of logged-in jobseeker
router.get(
  "/my-applications",
  VerifyToken,
  jobApplicationController.getMyApplications
);

// Get single application details
router.get("/:id", VerifyToken, jobApplicationController.getApplication);

// Withdraw (delete) an application
router.delete("/withdraw/:id",VerifyToken, jobApplicationController.withdrawApplication);

module.exports = router;
