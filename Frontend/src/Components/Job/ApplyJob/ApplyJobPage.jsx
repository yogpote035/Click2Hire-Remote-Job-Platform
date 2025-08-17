import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForJob } from "../../../../AllStateStore/JobSeeker/JobApplicationSlice";
import { useNavigate, useParams } from "react-router-dom";

const ApplyJobPage = () => {
  const { id } = useParams(); // jobPostId
  const dispatch = useDispatch();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      jobPostId: id,
      resume: formData.resume,
      coverLetter: formData.coverLetter,
    };

    dispatch(applyForJob(data, navigate));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Apply for Job</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Resume URL */}
        <div>
          <label className="block font-semibold mb-1">Resume URL</label>
          <input
            type="url"
            name="resume"
            placeholder="https://your-resume-link"
            value={formData.resume}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Cover Letter URL */}
        <div>
          <label className="block font-semibold mb-1">Cover Letter URL</label>
          <input
            type="url"
            name="coverLetter"
            placeholder="https://your-coverletter-link"
            value={formData.coverLetter}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

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
