// routes/jobApplicationRoutes.js
const express = require("express");
const router = express.Router();
const jobApplicationController = require("../../Controllers/Job/JobApplyingController");
const VerifyToken = require("../../Middleware/VerifyToken");
const cloudinaryUploadMiddleware = require("../../Middleware/cloudinaryUploadMiddleware");
const upload = require("../../Middleware/upload");

// Apply for a job
router.post(
  "/apply",
  VerifyToken,
  upload.fields([
    { name: "resume", maxCount: 1 }, // updated field name for both upload
    { name: "coverLetter", maxCount: 1 }, // updated field name for both upload
  ]),
  cloudinaryUploadMiddleware,
  jobApplicationController.applyForJob
);

// Get all applications of logged-in jobseeker
router.get(
  "/my-applications",
  VerifyToken,
  jobApplicationController.getMyApplications
);

// Get single application details
router.get("/:id", VerifyToken, jobApplicationController.getApplication);

// Withdraw (delete) an application
router.delete(
  "/withdraw/:id",
  VerifyToken,
  jobApplicationController.withdrawApplication
);

// download application
router.get(
  "/:id/download",
  VerifyToken,
  jobApplicationController.downloadApplication
);

module.exports = router;
