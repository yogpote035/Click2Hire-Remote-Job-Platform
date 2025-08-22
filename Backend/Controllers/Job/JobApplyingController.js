// controllers/jobApplicationController.js
const JobApplicationModel = require("../../Models/Employee/JobApplicationModel");
const JobPostingModel = require("../../Models/Employer/JobPostingModel");
const JobSeekerProfileModel = require("../../Models/Employee/JobSeekerProfileModel");

exports.applyForJob = async (req, res) => {
  try {
    console.log("Request in apply job: ");
    console.log("Request body: ", req.body);
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Only jobseekers can apply" });
    }

    // If applied  then not accept second application

    let { jobPostId, resume, coverLetter } = req.body;

    // if present in req.body
    if (resume) {
      resume.url = resume;
    }
    if (coverLetter) {
      coverLetter.url = coverLetter;
    }

    if (!jobPostId) {
      return res.status(400).json({ message: "Job Id is required" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Complete your profile first." });
    }

    const activeJob = JobPostingModel.findById(jobPostId);
    if (activeJob.status === "Closed") {
      return res
        .status(401)
        .json({ message: "Job is Closed No Longer Application Accepting" });
    }

    const AppliedApplication = await JobApplicationModel.find({
      jobPostId: jobPostId,
      userProfileId: profile,
    });

    if (AppliedApplication?.length) {
      return res.status(400).json({
        message:
          "Your Application for This Job Already Exists, You Can Edit or Delete Application",
      });
    }

    if (req?.uploadResults?.resume) {
      resume = {
        url: req.uploadResults.resume.url,
        publicId: req.uploadResults.resume.publicId,
      };
    }
    if (req?.uploadResults?.coverLetter) {
      coverLetter = {
        url: req.uploadResults.coverLetter.url,
        publicId: req.uploadResults.coverLetter.publicId,
      };
    }
    console.log("profile obj: ", resume);
    console.log("--------");
    console.log("resume obj: ", coverLetter);
    console.log("--------");
    if (!resume || !coverLetter) {
      return res
        .status(400)
        .json({ message: "Resume And Cover Letter is Required!!" });
    }
    const application = new JobApplicationModel({
      jobPostId,
      userProfileId: profile._id,
      resume,
      coverLetter,
    });

    await application.save();

    await JobPostingModel.updateOne(
      { _id: jobPostId },
      { $inc: { applicationCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications of logged-in jobseeker
exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const applications = await JobApplicationModel.find({
      userProfileId: profile._id,
    })
      .populate("jobPostId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single application (jobseeker can see their own)
exports.getApplication = async (req, res) => {
  try {
    const profile =
      req.user.role === "jobseeker"
        ? await JobSeekerProfileModel.findOne({ userId: req.user.userId })
        : null;

    const query = { _id: req.params.id };
    if (req.user.role === "jobseeker") query.userProfileId = profile._id;

    const application = await JobApplicationModel.findOne(query)
      .populate("jobPostId")
      .populate("userProfileId");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Withdraw (Delete) Application
exports.withdrawApplication = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(401).json({ message: "Only jobseekers can withdraw" });
    }

    const profile = await JobSeekerProfileModel.findOne({
      userId: req.user.userId,
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const application = await JobApplicationModel.findOne({
      _id: req.params.id,
      userProfileId: profile._id,
    });

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    await JobApplicationModel.findByIdAndDelete(req.params.id);
    await JobPostingModel.updateOne(
      { _id: req.query.jobId },
      { $inc: { applicationCount: -1 } }
    );

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadApplication = async (req, res) => {
  let puppeteer, browser;

  try {
    const application = await JobApplicationModel.findById(req.params.id)
      .populate("jobPostId")
      .populate("userProfileId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const jobId = application?.jobPostId?._id;
    const findProfile = await JobPostingModel.findById(jobId).populate(
      "employerProfileId",
      "companyName companyLogo"
    );

    const imageUrl = findProfile?.employerProfileId?.companyLogo?.url;
    const companyName = findProfile?.employerProfileId?.companyName;

    // Puppeteer setup
    if (process.env.NODE_ENV === "production") {
      puppeteer = require("puppeteer-core");
      const chromium = require("@sparticuz/chromium");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      puppeteer = require("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
    }

    const page = await browser.newPage();

    // --- Professional HTML Template ---
    const htmlContent = `
      <html>
        <head>
          <title>Job Application</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, sans-serif;
              padding: 30px;
              color: #333;
              background: #f9f9f9;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #0073e6;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header-left {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo {
              height: 60px;
              width: auto;
              border-radius: 8px;
              object-fit: contain;
              background: #fff;
              padding: 4px;
              border: 1px solid #ddd;
            }
            .company-name {
              font-size: 22px;
              font-weight: 600;
              color: #0073e6;
            }
            h1 {
              font-size: 24px;
              color: #0073e6;
              margin: 0;
            }
            h2 {
              font-size: 18px;
              margin: 20px 0 10px;
              color: #444;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .section {
              background: #fff;
              padding: 15px 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            p {
              margin: 5px 0;
              line-height: 1.5;
            }
            .bold {
              font-weight: 600;
            }
            a {
              color: #0073e6;
              text-decoration: none;
            }
            .skills, .languages, .benefits {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }
            .tag {
              background: #eaf4ff;
              color: #0073e6;
              padding: 4px 10px;
              border-radius: 5px;
              font-size: 13px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <img src="${
                imageUrl || "https://via.placeholder.com/120x60?text=Logo"
              }" class="logo" />
              <div class="company-name">${companyName || "Company Name"}</div>
            </div>
            <h1>Job Application</h1>
          </div>

          <!-- Job Info -->
          <div class="section">
            <h2>Job Information</h2>
            <p><span class="bold">Title:</span> ${
              application.jobPostId.title
            }</p>
            <p><span class="bold">Description:</span> ${
              application.jobPostId.description
            }</p>
            <p><span class="bold">Location:</span> ${
              application.jobPostId.location
            }</p>
            <p><span class="bold">Employment Type:</span> ${
              application.jobPostId.employmentType
            }</p>
            <p><span class="bold">Experience Level:</span> ${
              application.jobPostId.experienceLevel
            }</p>
            <p><span class="bold">Salary Range:</span> ${
              application.jobPostId.salaryRange.min
            } - ${application.jobPostId.salaryRange.max} ${
      application.jobPostId.salaryRange.currency
    }</p>
            <p><span class="bold">Deadline:</span> ${new Date(
              application.jobPostId.deadline
            ).toDateString()}</p>
            <div class="benefits">
              ${application.jobPostId.benefits
                .map((b) => `<span class="tag">${b}</span>`)
                .join(" ")}
            </div>
          </div>

          <!-- Applicant Info -->
          <div class="section">
            <h2>Applicant Information</h2>
            <p><span class="bold">Name:</span> ${
              application.userProfileId.fullName
            }</p>
            <p><span class="bold">Email:</span> ${
              application.userProfileId.email
            }</p>
            <p><span class="bold">Mobile:</span> ${
              application.userProfileId.mobileNumber
            }</p>
            <p><span class="bold">Location:</span> ${
              application.userProfileId.location
            }</p>
            <p><span class="bold">About:</span> ${
              application.userProfileId.about
            }</p>
            <p><span class="bold">Expected Salary:</span> ${
              application.userProfileId.expectedSalary
            }</p>
            <p><span class="bold">Skills:</span></p>
            <div class="skills">
              ${application.userProfileId.skills
                .map((s) => `<span class="tag">${s}</span>`)
                .join(" ")}
            </div>
            <p><span class="bold">Languages:</span></p>
            <div class="languages">
              ${application.userProfileId.languages
                .map((l) => `<span class="tag">${l}</span>`)
                .join(" ")}
            </div>
          </div>

          <!-- Application -->
          <div class="section">
            <h2>Application Details</h2>
            <p><span class="bold">Status:</span> ${application.status}</p>
            <p><span class="bold">Applied At:</span> ${new Date(
              application.appliedAt
            ).toDateString()}</p>
            <p><span class="bold">Resume:</span> <a href="${
              application.resume
            }">View Resume</a></p>
            <p><span class="bold">Cover Letter:</span> <a href="${
              application.coverLetter
            }">View Cover Letter</a></p>
          </div>

          <!-- Footer -->
          <div class="footer">
            © ${new Date().getFullYear()} ${
      companyName || "Company Name"
    } - Generated Job Application PDF
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="application_${application._id}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Download Application Error:", err);
    if (browser) await browser.close();
    res.status(500).json({ message: "Failed to download application" });
  }
};
