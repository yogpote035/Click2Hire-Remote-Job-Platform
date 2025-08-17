const express = require("express");
const router = express.Router();
const JobController = require("../../Controllers/Job/JobController");
const VerifyToken = require("../../Middleware/VerifyToken");

// Employer Protected Routes
router.get("/all-jobs", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);

module.exports = router;
