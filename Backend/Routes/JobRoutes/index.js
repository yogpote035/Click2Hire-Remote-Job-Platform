const express = require("express");
const router = express.Router();
const JobController = require("../../Controllers/Job/JobController");
const VerifyToken = require("../../Middleware/VerifyToken");

// Employer Protected Routes
router.get("/search-job", JobController.searchJobs);
router.get("/home-page-jobs", JobController.JobBasedOnLocation);
router.get("/all-jobs", VerifyToken, JobController.getAllJobs);
router.get("/:id", VerifyToken, JobController.getJobById);

module.exports = router;
