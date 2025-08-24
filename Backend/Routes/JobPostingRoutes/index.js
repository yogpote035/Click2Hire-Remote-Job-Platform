const express = require("express");
const router = express.Router();
const jobPostingController = require("../../Controllers/Job/JobPostingController");
const VerifyToken = require("../../Middleware/VerifyToken");
// company route get all and one
router.get("/all-employer", VerifyToken, jobPostingController.getAllCompanies);
router.get("/employer/:id", VerifyToken, jobPostingController.getCompanyById);
// find candidate for recent job
router.get(
  "/candidate",
  VerifyToken,
  jobPostingController.suggestCandidatesForEmployer
);
router.get("/candidate/:id", VerifyToken, jobPostingController.getCandidateById);
// Employer Protected Routes
router.post("/", VerifyToken, jobPostingController.createJobPosting);
router.get("/my-jobs", VerifyToken, jobPostingController.getMyJobs);
router.get("/:id", VerifyToken, jobPostingController.getJobById);
router.get(
  "/all-application/:id",
  VerifyToken,
  jobPostingController.AllApplicationForJob
); //all application for a job
router.get(
  "/single-application/:id/:profileId",
  VerifyToken,
  jobPostingController.SingleApplicationForJob
); //single application for a job
router.put(
  "/single-application/update-status/:id",
  VerifyToken,
  jobPostingController.SingleApplicationForJobUpdateStatusByEmployer
); //single application for a job
router.put("/:id", VerifyToken, jobPostingController.updateJobPosting);
router.delete("/:id", VerifyToken, jobPostingController.deleteJobPosting);
router.put("/:id/close", VerifyToken, jobPostingController.closeJob);

module.exports = router;
