import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs } from "../../../AllStateStore/Job/JobSlice";
import { useNavigate } from "react-router-dom";
import { Briefcase, MapPin, IndianRupee, Building2 } from "lucide-react";

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
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Explore Opportunities
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="border rounded-2xl p-6 shadow-sm hover:shadow-lg transition bg-white flex flex-col justify-between"
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Building2 size={16} /> {job.postedBy || "Company HR"}
              </p>
            </div>

            {/* Job Info */}
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                {job.location}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase size={16} className="text-gray-500" />
                {job.employmentType} · {job.remoteOption}
              </p>
              {job.salaryRange?.min && (
                <p className="flex items-center gap-2">
                  <IndianRupee size={16} className="text-gray-500" />
                  {job.salaryRange.min} - {job.salaryRange.max}{" "}
                  {job.salaryRange.currency}
                </p>
              )}
            </div>

            {/* Skills */}
            {job.skillsRequired?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skillsRequired.slice(0, 4).map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.skillsRequired.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{job.skillsRequired.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === "Open"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {job.status}
              </span>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                onClick={() => navigate(`/job/${job._id}`)}
              >
                View Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllJobsForSeeker;
