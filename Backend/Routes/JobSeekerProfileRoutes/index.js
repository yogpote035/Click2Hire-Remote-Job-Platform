const express = require("express");
const VerifyToken = require("../../Middleware/VerifyToken");
const JobseekerController = require("../../Controllers/Profile/Employee/JobseekerProfileController");
const router = express.Router();

router.get("/:userId", VerifyToken, JobseekerController.getProfileById);
router.post("/", VerifyToken, JobseekerController.createProfile);
router.put("/:userId", VerifyToken, JobseekerController.updateProfile);
router.delete("/:userId", VerifyToken, JobseekerController.deleteProfile);

module.exports = router;
