const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./Middleware/connectToDatabase");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "https://click2-hire-remote-job-platform.vercel.app",
  "https://click2-hire-remote-job-platform-click2hires-projects.vercel.app",
  "https://click2-hire-remote-job-platform-git-main-click2hires-projects.vercel.app",
  "https://click2-hire-remote-job-platform-r0iq7z4zu-click2hires-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.error("CORS error: Origin not allowed:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.get("/health", (req, res) => res.status(200).send("ok"));
app.head("/health", (req, res) => res.status(200).send("ok"));

app.get("/", (req, res) => {
  res.json("Welcome to TripUp Backend Development!");
});

// Authentication Routes
app.use("/api/auth/login", require("./Routes/Authentication/Login/index"));
app.use("/api/auth/signup", require("./Routes/Authentication/Signup/index"));
// ----------------------------------------------------------------------------------------------------
// Profile Routes

// Jobseeker
app.use(
  "/api/profile/jobseeker",
  require("./Routes/JobSeekerProfileRoutes/index")
);
// Employer
app.use(
  "/api/profile/employer",
  require("./Routes/EmployerProfileRoutes/index")
);
// -----------------------------------------------------------------------------------------------------
// Job posting And Operations Routes
app.use("/api/employer/job-post", require("./Routes/JobPostingRoutes/index"));
// -----------------------------------------------------------------------------------------------------

// Apply Job And Operations Routes
app.use(
  "/api/jobseeker/apply-job",
  require("./Routes/jobApplicationRoutes/index")
);
// -----------------------------------------------------------------------------------------------------

app.use("/api/job", require("./Routes/JobRoutes/index"));

// -----------------------------------------------------------------------------------------------------

// for scan resume
app.use("/api/resume-scan", require("./Routes/ResumeScanRoute/index"));

// Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT} ⛳`);
});
