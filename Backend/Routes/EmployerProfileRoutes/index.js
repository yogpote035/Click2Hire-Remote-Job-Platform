const express = require("express");
const VerifyToken = require("../../Middleware/VerifyToken");
const EmployerProfile = require("../../Controllers/Profile/Employer/EmployerProfileController");
const upload = require("../../Middleware/upload");
const cloudinaryUploadMiddleware = require("../../Middleware/cloudinaryUploadMiddleware");
const router = express.Router();

router.get("/:id", VerifyToken, EmployerProfile.getEmployerById);
router.post(
  "/",
  VerifyToken,
  upload.fields([
    { name: "companyLogo", maxCount: 1 }, // updated field name for both upload
  ]),
  cloudinaryUploadMiddleware,
  EmployerProfile.createEmployerProfile
);
router.put(
  "/:id",
  VerifyToken,
  upload.fields([
    { name: "companyLogo", maxCount: 1 }, // updated field name for both upload
  ]),
  cloudinaryUploadMiddleware,
  EmployerProfile.updateEmployerProfile
);
router.delete("/:id", VerifyToken, EmployerProfile.deleteEmployerProfile);

module.exports = router;
