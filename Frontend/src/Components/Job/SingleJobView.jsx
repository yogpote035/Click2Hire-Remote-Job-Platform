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
    <div className="max-w-4xl mx-auto p-6 mt-1 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
      <p className="text-gray-600 mt-2">{job.location}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {job.employmentType}
        </span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          {job.remoteOption}
        </span>
        <span
          className={`px-2 py-1 rounded text-sm ${
            job.status === "Open"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {job.status}
        </span>
        {job.jobLevel && (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
            {job.jobLevel}
          </span>
        )}
      </div>

      {job.status === "Closed" && (
        <p className="mt-4 text-red-500 font-bold">
          <strong className="text-indigo-400">Job is Closed:</strong> No Longer
          Application Accepting
        </p>
      )}

      {job.skillsRequired?.length > 0 && (
        <p className="mt-4 text-gray-700">
          <strong>Skills Required:</strong> {job.skillsRequired.join(", ")}
        </p>
      )}

      {job.salaryRange && (
        <p className="mt-2 text-gray-700">
          <strong>Salary:</strong> {job.salaryRange.min} - {job.salaryRange.max}{" "}
          {job.salaryRange.currency}
        </p>
      )}

      {job.experienceLevel && (
        <p className="mt-2 text-gray-700">
          <strong>Experience Level:</strong> {job.experienceLevel}
        </p>
      )}

      {job.educationRequired && (
        <p className="mt-2 text-gray-700">
          <strong>Education Required:</strong> {job.educationRequired}
        </p>
      )}
      {job.location && (
        <p className="mt-2 text-gray-700">
          <strong>Location:</strong> {job.location}
        </p>
      )}

      {job.description && (
        <div className="mt-4 text-gray-700">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p>{job.description}</p>
        </div>
      )}

      {job.benefits?.length > 0 && (
        <div className="mt-4 text-gray-700">
          <h2 className="text-xl font-semibold mb-2">Benefits</h2>
          <ul className="list-disc list-inside">
            {job.benefits.map((b, index) => (
              <li key={index}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-gray-500 text-sm">
        <strong>Application Method:</strong> {job.applicationMethod}
      </p>

      <p className="mt-1 text-gray-400 text-sm">
        <strong>Posted By:</strong> {job.postedBy} | <strong>Deadline:</strong>{" "}
        {new Date(job.deadline).toLocaleDateString()}
      </p>

      {job.status !== "Closed" &&
        localStorage.getItem("role") === "jobseeker" && (
          <div className="flex justify-center mt-5">
            <button
              onClick={() => {
                navigate(`/apply-job/${job._id}`);
              }}
              className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-md px-4"
            >
              Apply This Job
            </button>
          </div>
        )}
    </div>
  );
};

export default SingleJobView;
