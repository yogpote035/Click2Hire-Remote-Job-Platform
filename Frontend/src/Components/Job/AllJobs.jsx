import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs } from "../../../AllStateStore/Job/JobSlice";
import { useNavigate } from "react-router-dom";

const AllJobsForSeeker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allJobs: jobs, loading, error } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  if (loading)
    return <p className="text-center mt-25 text-gray-500">Loading jobs...</p>;
  if (error) return <p className="text-center mt-25 text-red-500">{error}</p>;
  if (!jobs || jobs.length === 0)
    return <p className="text-center mt-25 text-gray-500">No jobs found.</p>;
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Available Jobs</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {jobs &&
          jobs?.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.location}</p>
                <div className="mt-2 flex flex-wrap gap-2">
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
                </div>
                {job.skillsRequired?.length > 0 && (
                  <p className="mt-2 text-gray-700">
                    Skills: {job.skillsRequired.join(", ")}
                  </p>
                )}
                {job.salaryRange && (
                  <p className="mt-1 text-gray-700">
                    Salary: {job.salaryRange.min} - {job.salaryRange.max}{" "}
                    {job.salaryRange.currency}
                  </p>
                )}
              </div>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded self-start"
                onClick={() => navigate(`/job/${job._id}`)}
              >
                View Job
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllJobsForSeeker;
