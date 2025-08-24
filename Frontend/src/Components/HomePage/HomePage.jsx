import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HomePageJobs } from "../../../AllStateStore/Job/JobSlice";

const HomePage = () => {
  const role =
    useSelector((state) => state.authentication.role) ||
    localStorage.getItem("role"); // Replace with Redux state later
  const navigate = useNavigate();

  // search states
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const allJobs = useSelector((state) => state.job.allJobs);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(HomePageJobs());
  }, []);

  const handleSearch = () => {
    if (!query && !location) {
      toast.error("Please enter a skill/title or location", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      return;
    }

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (location) params.append("location", location);

    navigate(`/job/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-inter">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-blue-700">
            {role === "employer"
              ? "Hire Top Talent Effortlessly"
              : "Find Your Dream Job Today"}
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            {role === "employer"
              ? "Post jobs, track applicants, and build your dream team with ease."
              : "Browse thousands of curated job listings and apply in one click."}
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Job title or skill"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 rounded-lg border w-full sm:w-64 focus:outline-none shadow-sm"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 rounded-lg border w-full sm:w-64 focus:outline-none shadow-sm"
            />
            <button
              onClick={handleSearch}
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {role === "employer" && (
            <Link
              to="/post-job"
              className="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Post a Job
            </Link>
          )}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Featured Jobs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allJobs?.map((job) => (
            <div
              key={job?._id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
            >
              <h4 className="text-lg font-semibold text-gray-900">
                {job?.title}
              </h4>
              <p className="text-gray-600">
                {job?.companyName} {job?.location}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ₹{job?.salaryRange?.min}-{job?.salaryRange?.max}
              </p>
              <button
                onClick={() => {
                  if (role === "jobseeker") {
                    navigate(`/job/${job?._id}`);
                  }
                  if (role === "employer") {
                    navigate(`/post-job/${job?._id}/applications`);
                  }
                  if (!role) {
                    navigate(`/login`);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {role === "employer"
                  ? "View Applicants"
                  : role === "jobseeker"
                  ? "Apply Now"
                  : "Create Profile For Apply This Job"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-3xl font-bold text-blue-600">10K+</h4>
            <p className="text-gray-600">Active Jobs</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-blue-600">5K+</h4>
            <p className="text-gray-600">Companies</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-blue-600">20K+</h4>
            <p className="text-gray-600">Successful Hires</p>
          </div>
        </div>
      </section>

      {/* Role-Based CTA */}
      <section className="py-12 px-4 text-center">
        {role === "jobseeker" ? (
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Recommended Jobs
          </Link>
        ) : (
          <Link
            to="/post-job"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Post a New Job & Manage Applicants
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
