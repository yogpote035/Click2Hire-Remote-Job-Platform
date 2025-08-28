import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchJobs } from "../../../AllStateStore/Job/JobSlice";
import toast from "react-hot-toast";

const ShowSearchedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const search = queryParams.get("query") || "";
  const location = queryParams.get("location") || "";

  const { loading, error, allJobs: jobs } = useSelector((state) => state.job);

  const [expandedJob, setExpandedJob] = useState(null); // track expanded job

  useEffect(() => {
    if (!search && !location) {
      toast.error("Please fill at least one field");
      return;
    }
    dispatch(SearchJobs(search, location));
  }, [dispatch, search, location]);

  if (loading)
    return <p className="text-center mt-5 text-gray-500">Loading jobs...</p>;

  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Jobs {search ? `for: ${search}` : ""} {location ? `in ${location}` : ""}
      </h2>

      {jobs?.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs?.map((job) => {
            const isExpanded = expandedJob === job._id;
            return (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={job?.employerProfileId?.companyLogo?.url}
                    alt="Logo"
                    className="h-10 w-10 rounded-full border object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {job.employerProfileId?.companyName}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-2">{job.location}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Skills: {job.skillsRequired?.join(", ")}
                </p>

                {/* Description with "Show More" */}
                <p className="text-gray-600 text-sm">
                  {isExpanded
                    ? job.description
                    : job.description.slice(0, 20) + "..."}
                </p>
                <button
                  className="text-indigo-500 text-sm mt-1 hover:underline"
                  onClick={() =>
                    setExpandedJob(isExpanded ? null : job._id)
                  }
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>

                {/* View Job button */}
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Job
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowSearchedJobs;
