const express = require("express");
const VerifyToken = require("../../Middleware/VerifyToken");
const JobseekerController = require("../../Controllers/Profile/Employee/JobseekerProfileController");
const cloudinaryUploadMiddleware = require("../../Middleware/cloudinaryUploadMiddleware");
const upload = require("../../Middleware/upload");
const router = express.Router();

router.get("/:userId", VerifyToken, JobseekerController.getProfileById);
router.post(
  "/",
  upload.fields([
    { name: "profilePicture", maxCount: 1 }, // updated field name for both upload
    { name: "resumeUrl", maxCount: 1 },
  ]),
  cloudinaryUploadMiddleware,
  VerifyToken,
  JobseekerController.createProfile
);
router.put(
  "/:userId",
  VerifyToken,
  upload.fields([
    { name: "profilePicture", maxCount: 1 }, // updated field name for both upload
    { name: "resumeUrl", maxCount: 1 },
  ]),
  cloudinaryUploadMiddleware,
  JobseekerController.updateProfile
);
router.delete("/:userId", VerifyToken, JobseekerController.deleteProfile);

module.exports = router;
