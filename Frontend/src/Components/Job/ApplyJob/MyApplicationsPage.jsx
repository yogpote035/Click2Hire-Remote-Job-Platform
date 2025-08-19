import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadApplication,
  getMyApplications,
} from "../../../../AllStateStore/JobSeeker/JobApplicationSlice";
import { Link, useNavigate } from "react-router-dom";

const MyApplicationsPage = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector(
    (state) => state.jobseekerApplyJob
  );

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500">Loading applications...</p>
    );
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!applications.length)
    return (
      <p className="text-center mt-20 text-gray-500">No applications yet.</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Applications</h2>

      <div className="grid gap-6">
        {applications.map((app) => {
          const job = app.jobPostId;
          return (
            <div
              key={app._id}
              className="border rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition"
            >
              {/* Job Title & Location */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {job?.title}
                  </h3>
                  <p className="text-gray-600">{job?.location}</p>
                </div>

                {/* Status */}
                <span
                  className={`mt-3 md:mt-0 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === "Applied"
                      ? "bg-blue-100 text-blue-700"
                      : app.status === "Under Review"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "Shortlisted"
                      ? "bg-green-100 text-green-700"
                      : app.status === "Interview"
                      ? "bg-purple-100 text-purple-700"
                      : app.status === "Offered"
                      ? "bg-teal-100 text-teal-700"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Job Details */}
              <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Employment:</span>{" "}
                  {job?.employmentType}
                </p>
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {job?.experienceLevel}
                </p>
                <p>
                  <span className="font-medium">Education:</span>{" "}
                  {job?.educationRequired}
                </p>
                <p>
                  <span className="font-medium">Work Schedule:</span>{" "}
                  {job?.workSchedule}
                </p>
                <p>
                  <span className="font-medium">Salary:</span>{" "}
                  {job?.salaryRange
                    ? `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} ${job.salaryRange.currency}`
                    : "Not specified"}
                </p>
                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {job?.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/my-application/${app._id}`}
                  className="text-white bg-gray-800 hover:bg-gray-900 px-3 py-1 rounded shadow"
                >
                  View Application
                </Link>
                <button
                  onClick={() => dispatch(downloadApplication(app._id))}
                  className="text-white bg-gray-800 hover:bg-gray-900 px-3 py-1 rounded shadow"
                >
                  Download Application
                </button>
              </div>

              {/* Footer */}
              <p className="mt-4 text-xs text-gray-500">
                Applied on{" "}
                {app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
