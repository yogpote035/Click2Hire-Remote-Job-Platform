import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyApplications } from "../../../../AllStateStore/JobSeeker/JobApplicationSlice";
import { Link, useNavigate } from "react-router-dom";

const MyApplicationsPage = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector(
    (state) => state.jobseekerApplyJob
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      await dispatch(getMyApplications());
    };
    fetchApplications();
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
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Applications</h2>

      <div className="grid gap-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="border rounded-lg p-4 shadow bg-white flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              {/* Job Details */}
              <h3 className="text-xl font-semibold text-gray-800">
                {app.jobPostId?.title}
              </h3>
              <p className="text-gray-600">{app.jobPostId?.location}</p>

              {/* Status */}
              <span
                className={`inline-block mt-2 px-2 py-1 rounded text-sm font-medium ${
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

              {/* Resume & Cover Letter URLs */}
              <div className="mt-3 space-x-4">
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-gray-800 hover:bg-gray-900 p-1 rounded px-2 shadow hover:shadow-2xl hover:underline"
                >
                  View Resume
                </a>
                <a
                  href={app.coverLetter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-gray-800 hover:bg-gray-900 p-1 rounded px-2 shadow hover:shadow-2xl hover:underline"
                >
                  View Cover Letter
                </a>
                <Link
                  to={`/my-application/${app._id}`}
                  className="text-white bg-gray-800 hover:bg-gray-900 p-1 rounded px-2 shadow hover:shadow-2xl hover:underline"
                >
                  View Application
                </Link>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              Applied on {new Date(app.appliedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
