const express = require("express");
const router = express.Router();
const jobPostingController = require("../../Controllers/Job/JobPostingController");
const VerifyToken = require("../../Middleware/VerifyToken");


// Employer Protected Routes
router.post("/", VerifyToken, jobPostingController.createJobPosting);
router.get("/my-jobs", VerifyToken, jobPostingController.getMyJobs);
router.get("/:id",VerifyToken, jobPostingController.getJobById); 
router.put("/:id", VerifyToken, jobPostingController.updateJobPosting);
router.delete("/:id", VerifyToken, jobPostingController.deleteJobPosting);
router.put("/:id/close", VerifyToken, jobPostingController.closeJob);

module.exports = router;
