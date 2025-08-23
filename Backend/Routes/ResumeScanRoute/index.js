const express = require("express");
const upload = require("../../Middleware/upload");
const VerifyToken = require("../../Middleware/VerifyToken");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // limit each IP to 5 requests per windowMs
  message: {
    ok: false,
    error: "Too many requests. Please try again later.",
  },
  headers: true, // send rate limit info in headers
});
const {
  ResumeScan,
} = require("../../Controllers/ResumeScan/ResumeScanController");
const router = express.Router();

router.post("/", limiter, VerifyToken, upload.single("resume"), ResumeScan);

module.exports = router;
