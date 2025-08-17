import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Building,
  LockKeyhole,
  Phone,
} from "lucide-react";
import {
  signupJobseeker,
  signupEmployer,
} from "../../../AllStateStore/Authentication/AuthenticationSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
export default function SignupPage() {
  const [role, setRole] = useState("jobseeker"); // default
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Form data states
  const [formDataJobSeeker, setFormDataJobSeeker] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [formDataEmployer, setFormDataEmployer] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    companyName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (role === "jobseeker") {
      setFormDataJobSeeker((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormDataEmployer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitJobSeeker = (e) => {
    e.preventDefault();
    if (
      !formDataJobSeeker.fullName ||
      !formDataJobSeeker.email ||
      !formDataJobSeeker.mobileNumber ||
      !formDataJobSeeker.password
    ) {
      toast.warn("Please fill all fields");
      return;
    }
    dispatch(signupJobseeker(formDataJobSeeker, navigate));
  };

  const handleSubmitEmployer = (e) => {
    if (
      !formDataEmployer.fullName ||
      !formDataEmployer.email ||
      !formDataEmployer.mobileNumber ||
      !formDataEmployer.password ||
      !formDataEmployer.companyName
    ) {
      toast.warn("Please fill all fields");
      return;
    }
    e.preventDefault();
    dispatch(signupEmployer(formDataEmployer, navigate));
  };

  useEffect(() => {
    const preventNumberScroll = (e) => {
      if (e.target.type === "number") {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", preventNumberScroll, { passive: false });
    document.addEventListener("keydown", (e) => {
      if (
        e.target.type === "number" &&
        (e.key === "ArrowUp" || e.key === "ArrowDown")
      ) {
        e.preventDefault();
      }
    });

    return () => {
      document.removeEventListener("wheel", preventNumberScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-4 bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
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
        <form
          className="space-y-4"
          onSubmit={
            role === "jobseeker" ? handleSubmitJobSeeker : handleSubmitEmployer
          }
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="fullName"
                value={
                  role === "jobseeker"
                    ? formDataJobSeeker.fullName
                    : formDataEmployer.fullName
                }
                onChange={handleChange}
                className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={
                  role === "jobseeker"
                    ? formDataJobSeeker.email
                    : formDataEmployer.email
                }
                onChange={handleChange}
                className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="tel"
                name="mobileNumber"
                value={
                  role === "jobseeker"
                    ? formDataJobSeeker.mobileNumber
                    : formDataEmployer.mobileNumber
                }
                onChange={handleChange}
                pattern="[0-9]{10}"
                className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <LockKeyhole
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={
                  role === "jobseeker"
                    ? formDataJobSeeker.password
                    : formDataEmployer.password
                }
                onChange={handleChange}
                className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="•••••••••"
                required
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
                  name="companyName"
                  value={formDataEmployer.companyName}
                  onChange={handleChange}
                  className="pl-10 mt-1 w-full border-gray-300 rounded-lg shadow-sm p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="ABC Pvt Ltd"
                  required
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
  );
}
