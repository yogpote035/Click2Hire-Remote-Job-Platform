import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Building, Lock } from "lucide-react";

export default function SignupPage() {
  const [role, setRole] = useState("jobseeker"); // default
  const [showPassword, setShowPassword] = useState(false);
 window.scrollTo(0, 0);
  return (
    <>
      <div className="min-h-screen m-25 flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
              <span className="text-[#2563EB]">Click</span>
              <span className="text-[#F97316]">2</span>
              <span className="text-[#1E3A8A]">Hire</span>
            </h1>
            <p className="text-sm text-gray-500">Your Career, One Click Away</p>
          </div>

          {/* Role Switch */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setRole("jobseeker")}
              className={`px-4 py-2 rounded-l-full border focus:outline-none ${
                role === "jobseeker"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setRole("employer")}
              className={`px-4 py-2 rounded-r-full border focus:outline-none ${
                role === "employer"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              Employer
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Employer Extra Field */}
            {role === "employer" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    placeholder="ABC Pvt Ltd"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up as {role === "jobseeker" ? "Job Seeker" : "Employer"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
