const express = require("express");
const VerifyToken = require("../../Middleware/VerifyToken");
const EmployerProfile = require("../../Controllers/Profile/Employer/EmployerProfileController");
const router = express.Router();

router.get("/:id", VerifyToken, EmployerProfile.getEmployerById);
router.post("/", VerifyToken, EmployerProfile.createEmployerProfile);
router.put("/:id", VerifyToken, EmployerProfile.updateEmployerProfile);
router.delete("/:id", VerifyToken, EmployerProfile.deleteEmployerProfile);

module.exports = router;
