import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllApplicationsForJob } from "../../../../AllStateStore/Employer/JobPostSlice";

import { Link, useParams } from "react-router-dom";

export default function JobApplicationsList() {
  const dispatch = useDispatch();
  const { id } = useParams(); // get jobId from URL
  const { loading, error, allApplication } = useSelector(
    (state) => state.employerJobPost
  );

  const applications = Array.isArray(allApplication) ? allApplication : [];

  useEffect(() => {
    if (id) dispatch(getAllApplicationsForJob(id));
  }, [dispatch, id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Applications for Job</h2>

      {loading && <p className="text-blue-500">Loading applications...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && applications?.length === 0 && (
        <p className="text-gray-500">No applications found for this job.</p>
      )}

      <div className="space-y-4">
        {applications &&
          applications?.map((app) => (
            <div
              key={app?._id}
              className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md"
            >
              
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {app?.userProfileId?.fullName}
                  </h3>
                  {/* try */}
                  <h3 className="font-semibold text-lg">
                    {app?.employmentType}
                  </h3>
                  <p className="text-gray-600">{app?.userProfileId?.email}</p>

                  <p>
                    <strong>Applied At:</strong>{" "}
                    {new Date(app?.appliedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    app.status === "Applied"
                      ? "bg-blue-100 text-blue-600"
                      : app.status === "Interview"
                      ? "bg-yellow-100 text-yellow-600"
                      : app.status === "Offered"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {app?.status}
                </span>
              </div>

              <div className="mt-3 flex gap-4">
                <a
                  href={app?.resume?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
                <a
                  href={app?.coverLetter?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Cover Letter
                </a>
                {(id || app?.userProfileId?._id) && (
                  <Link
                    to={`/post-job/${id}/applications/${app?.userProfileId?._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
