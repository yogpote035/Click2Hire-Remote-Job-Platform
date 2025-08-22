import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleJob } from "../../../AllStateStore/Job/JobSlice";
import { useParams, useNavigate } from "react-router-dom";

const SingleJobView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleJob: job, loading, error } = useSelector((state) => state.job);

  useEffect(() => {
    if (id) dispatch(getSingleJob(id));
  }, [dispatch, id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading job...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!job)
    return <p className="text-center mt-10 text-gray-500">Job not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 mt-6 mb-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <img
          src={job?.employerProfileId?.companyLogo?.url}
          alt="Logo"
          className="h-14 w-14 rounded-full border border-gray-200"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {job?.employerProfileId?.companyName}
          </h2>
          <p className="text-gray-500 text-sm">{job.location}</p>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">{job.title}</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {job.employmentType}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {job.remoteOption}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === "Open"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {job.status}
          </span>
          {job.jobLevel && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {job.jobLevel}
            </span>
          )}
        </div>
      </div>

      {job.status === "Closed" && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <strong className="text-red-800">Job Closed:</strong> No longer accepting applications
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {job.skillsRequired?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Skills Required</h3>
            <p className="text-gray-600">{job.skillsRequired.join(", ")}</p>
          </div>
        )}
        {job.salaryRange && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Salary</h3>
            <p className="text-gray-600">
              ₹{job.salaryRange.min.toLocaleString()} - ₹{job.salaryRange.max.toLocaleString()}{" "}
              {job.salaryRange.currency}
            </p>
          </div>
        )}
        {job.experienceLevel && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Experience</h3>
            <p className="text-gray-600">{job.experienceLevel}</p>
          </div>
        )}
        {job.educationRequired && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Education</h3>
            <p className="text-gray-600">{job.educationRequired}</p>
          </div>
        )}
      </div>

      {job.description && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>
      )}

      {job.benefits?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Benefits</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {job.benefits.map((b, index) => (
              <li key={index}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-4">
        <div className="text-sm text-gray-500">
          <p>
            <strong>Application Method:</strong> {job.applicationMethod}
          </p>
          <p className="mt-1">
            <strong>Posted By:</strong> {job.postedBy} | <strong>Deadline:</strong>{" "}
            {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>

        {job.status !== "Closed" &&
          localStorage.getItem("role") === "jobseeker" && (
            <button
              onClick={() => navigate(`/apply-job/${job._id}`)}
              className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              Apply Now
            </button>
          )}
      </div>
    </div>
  );
};

export default SingleJobView;
