// middleware/cloudinaryUpload.js
const cloudinary = require("./cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const cloudinaryUploadMiddleware = async (req, res, next) => {
  try {
    const results = {};
    console.log("request in cloudinary middleware");
    //for emp profile
    if (req.files?.profilePicture) {
      results.profilePicture = await uploadToCloudinary(
        req.files.profilePicture[0].buffer,
        "profiles/images",
        "image"
      );
    }
    //for company profile
    if (req.files?.companyLogo) {
      results.companyLogo = await uploadToCloudinary(
        req.files.companyLogo[0].buffer,
        "profiles/images",
        "image"
      );
    }
    //for emp resume
    if (req.files?.resumeUrl) {
      results.resumeUrl = await uploadToCloudinary(
        req.files.resumeUrl[0].buffer,
        "profiles/resumes",
        "raw" // raw for pdf/doc/docx
      );
    }
    // apply job
    //for emp resume
    if (req.files?.resume) {
      results.resume = await uploadToCloudinary(
        req.files.resume[0].buffer,
        "job/application/resumes",
        "raw" // raw for pdf/doc/docx
      );
    } //for emp resume
    if (req.files?.coverLetter) {
      results.coverLetter = await uploadToCloudinary(
        req.files.coverLetter[0].buffer,
        "job/application/coverLetter",
        "raw" // raw for pdf/doc/docx
      );
    }

    req.uploadResults = results; // add to request and access in controller
    console.log("request end  in cloudinary middleware");

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = cloudinaryUploadMiddleware;
