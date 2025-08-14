import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const role = "jobseeker"; // Replace with Redux state later

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
              className="px-4 py-2 rounded-lg border w-full sm:w-64 focus:outline-none shadow-sm"
            />
            <input
              type="text"
              placeholder="Location"
              className="px-4 py-2 rounded-lg border w-full sm:w-64 focus:outline-none shadow-sm"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
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
          {[1, 2, 3, 4, 5, 6].map((job) => (
            <div
              key={job}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
            >
              <h4 className="text-lg font-semibold text-gray-900">
                Software Engineer
              </h4>
              <p className="text-gray-600">Google • New York, USA</p>
              <p className="text-sm text-gray-500 mb-4">₹15 LPA</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                {role === "employer" ? "View Applicants" : "Apply Now"}
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
