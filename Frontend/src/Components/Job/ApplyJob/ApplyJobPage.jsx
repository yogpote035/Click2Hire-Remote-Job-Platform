import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForJob } from "../../../../AllStateStore/JobSeeker/JobApplicationSlice";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ApplyJobPage = () => {
  const { id } = useParams(); // jobPostId
  const dispatch = useDispatch();
  const [Resume, setResume] = useState(null); //upload
  const [CoverLatter, setCoverLatter] = useState(null); //upload
  const [previewFileResume, setProfileFileResume] = useState(null);
  const [previewFileCoverLetter, setProfileFileCoverLetter] = useState(null);
  const [resumeToggle, setResumeToggle] = useState(false);
  const [toggleCoverLetter, setToggleCoverLetter] = useState(false);
  const { loading } = useSelector((state) => state.jobseekerApplyJob);

  const [formData, setFormData] = useState({
    resume: "",
    coverLetter: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function objectToFormData(obj, form = new FormData(), namespace = "") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const formKey = namespace ? `${namespace}[${key}]` : key;

        if (value instanceof File) {
          // File (profilePicture, resumeUrl)
          form.append(formKey, value);
        } else if (Array.isArray(value)) {
          // Handle arrays
          value.forEach((item, index) => {
            if (typeof item === "object" && !(item instanceof File)) {
              objectToFormData(item, form, `${formKey}[${index}]`);
            } else {
              form.append(`${formKey}[${index}]`, item);
            }
          });
        } else if (typeof value === "object" && value !== null) {
          // Nested objects
          objectToFormData(value, form, formKey);
        } else if (value !== undefined && value !== null) {
          // Primitive values
          form.append(formKey, value);
        }
      }
    }
    return form;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = objectToFormData();

    // Append files

    if (Resume || CoverLatter) {
      if (!Resume|| !CoverLatter) {
        return toast.error("Please Upload Both Files or Url's")
      }
      form.append("jobPostId", id);
      if (Resume) form.append("resume", Resume);
      if (CoverLatter) form.append("coverLetter", CoverLatter);
      console.log("🔍 FormData entries:");
      // for (let [key, value] of form.entries()) {
      //   console.log(key, value);
      // }
      dispatch(applyForJob(form, navigate));
      return;
    }
    const data = {
      jobPostId: id,
      resume: formData.resume,
      coverLetter: formData.coverLetter,
    };
    dispatch(applyForJob(data, navigate));
  };

  return (
    <div className="max-w-5xl w-full outline-none focus:outline-none mx-auto p-6 bg-white shadow rounded mt-4 mb-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Apply for Job</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Resume URL */}
        {/* Resume Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload Resume</label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files[0];
              setResume(file); // store for upload
              if (file) {
                setProfileFileResume(URL.createObjectURL(file)); // preview locally
              }
            }}
            required={!formData.resume}
            className="border p-2 rounded w-full outline-none focus:outline-none"
          />
          {Resume && (
            <button
              type="button"
              className={`block text-white mt-2 py-1 bg-gray-700 px-2 rounded ${
                resumeToggle ? "bg-gray-600" : ""
              }`}
              onClick={() => setResumeToggle(!resumeToggle)}
            >
              {resumeToggle
                ? "Hide Resume Preview"
                : "See Resume Preview (PDF)"}
            </button>
          )}
        </div>

        <h1 className="text-xl text-gray-700 text-center mt-4">OR</h1>

        <div>
          <label className="block font-semibold mb-1">Resume URL</label>
          <input
            type="url"
            name="resume"
            placeholder="https://your-resume-link"
            value={formData.resume}
            onChange={handleChange}
            required={!Resume}
            className="border p-2 rounded w-full outline-none focus:outline-none"
          />
        </div>

        {/* Cover Letter Upload */}
        <div>
          <label className="block font-semibold mb-1">
            Upload Cover Letter
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            name="coverLetter"
            onChange={(e) => {
              const file = e.target.files[0];
              setCoverLatter(file); // store for upload
              if (file) {
                setProfileFileCoverLetter(URL.createObjectURL(file)); // preview locally
              }
            }}
            required={!formData.coverLetter}
            className="border p-2 rounded w-full outline-none focus:outline-none"
          />
          {CoverLatter && (
            <button
              type="button"
              className={`block text-white mt-2 py-1 bg-gray-700 px-2 rounded ${
                toggleCoverLetter ? "bg-gray-600" : ""
              }`}
              onClick={() => setToggleCoverLetter(!toggleCoverLetter)}
            >
              {toggleCoverLetter
                ? "Hide Cover Letter Preview"
                : "See Cover Letter Preview (PDF)"}
            </button>
          )}
        </div>

        <h1 className="text-xl text-gray-700 text-center mt-4">OR</h1>

        <div>
          <label className="block font-semibold mb-1">Cover Letter URL</label>
          <input
            type="url"
            name="coverLetter"
            placeholder="https://your-coverletter-link"
            value={formData.coverLetter}
            onChange={handleChange}
            required={!CoverLatter}
            className="border p-2 rounded w-full outline-none focus:outline-none"
          />
        </div>

        {/* PDF Previews */}
        {resumeToggle && previewFileResume && (
          <div className="border rounded-md overflow-hidden h-96 mt-4">
            <iframe
              src={previewFileResume}
              title="Resume Preview"
              className="w-full h-full"
            ></iframe>
          </div>
        )}

        {toggleCoverLetter && previewFileCoverLetter && (
          <div className="border rounded-md overflow-hidden h-96 mt-4">
            <iframe
              src={previewFileCoverLetter}
              title="Cover Letter Preview"
              className="w-full h-full"
            ></iframe>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJobPage;
