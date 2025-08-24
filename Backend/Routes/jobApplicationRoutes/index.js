// routes/jobApplicationRoutes.js
const express = require("express");
const router = express.Router();
const jobApplicationController = require("../../Controllers/Job/JobApplyingController");
const VerifyToken = require("../../Middleware/VerifyToken");
const cloudinaryUploadMiddleware = require("../../Middleware/cloudinaryUploadMiddleware");
const upload = require("../../Middleware/upload");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // limit each IP to 5 requests per windowMs
  message: {
    ok: false,
    error:
      "Too many requests. Please try again later. You Have Limit To Download Application, 3 Request per Minute",
  },
  headers: true, // send rate limit info in headers
});
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
  limiter,
  VerifyToken,
  jobApplicationController.downloadApplication
);

module.exports = router;
