import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff, Phone, Key } from "lucide-react";
import { SiAwssecretsmanager } from "react-icons/si";
import { useDispatch } from "react-redux";
import {
  loginEmailPassword,
  loginNumberPassword,
  otpSent,
  verifyOtp,
} from "../../../AllStateStore/Authentication/AuthenticationSlice";
import toast from "react-hot-toast";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const navigate = useNavigate(); // Navigate to home after successful login ,sent it with data to dispatch
  const dispatch = useDispatch(); // Import useDispatch from react-redux to dispatch actions
  // Separate states for each method
  const [emailLogin, setEmailLogin] = useState({ email: "", password: "" });
  const [mobilePasswordLogin, setMobilePasswordLogin] = useState({
    mobile: "",
    password: "",
  });
  const [emailOtpLogin, setEmailOtpLogin] = useState({
    email: "",
    otp: "",
  });

  // Handlers
  const handleEmailLogin = (e) => {
    e.preventDefault();
    console.log("Email login data:", emailLogin);
    dispatch(
      loginEmailPassword(emailLogin.email, emailLogin.password, navigate)
    );
  };

  const handleMobilePasswordLogin = (e) => {
    e.preventDefault();
    console.log("Mobile + Password login data:", mobilePasswordLogin);
    dispatch(
      loginNumberPassword(
        mobilePasswordLogin.mobile,
        mobilePasswordLogin.password,
        navigate
      )
    );
  };

  const handleEmailOtpLogin = (e) => {
    e.preventDefault();
    console.log("Email + OTP login data:", emailOtpLogin);
    dispatch(verifyOtp(emailOtpLogin.email, emailOtpLogin.otp, navigate));
  };

  window.scrollTo(0, 0);

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
    <div className="min-h-screen flex mt-15 items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">
            <span className="text-[#2563EB]">Click</span>
            <span className="text-[#F97316]">2</span>
            <span className="text-[#1E3A8A]">Hire</span>
          </h1>
          <p className="text-sm text-gray-500">Your Career, One Click Away</p>
        </div>

        {/* Login Method Switch */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setLoginMethod("email")}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              loginMethod === "email"
                ? "bg-[#2563EB] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Email + Password
          </button>
          <button
            onClick={() => setLoginMethod("mobile-password")}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              loginMethod === "mobile-password"
                ? "bg-[#F97316] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Mobile + Password
          </button>
          <button
            onClick={() => setLoginMethod("email-otp")}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              loginMethod === "email-otp"
                ? "bg-[#1E3A8A] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Email + OTP
          </button>
        </div>

        {/* Email Login */}
        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={emailLogin.email}
                  onChange={(e) =>
                    setEmailLogin({ ...emailLogin, email: e.target.value })
                  }
                  className="w-full pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={emailLogin.password}
                  required
                  onChange={(e) =>
                    setEmailLogin({ ...emailLogin, password: e.target.value })
                  }
                  className="w-full pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {showPassword ? (
                  <EyeOff
                    size={18}
                    onClick={() => setShowPassword(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  />
                ) : (
                  <Eye
                    size={18}
                    onClick={() => setShowPassword(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        )}

        {/* Mobile + Password */}
        {loginMethod === "mobile-password" && (
          <form onSubmit={handleMobilePasswordLogin} className="space-y-4">
            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="relative mt-1">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  required
                  pattern="[0-9]*"
                  value={mobilePasswordLogin.mobile}
                  onChange={(e) =>
                    setMobilePasswordLogin({
                      ...mobilePasswordLogin,
                      mobile: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={mobilePasswordLogin.password}
                  required
                  onChange={(e) =>
                    setMobilePasswordLogin({
                      ...mobilePasswordLogin,
                      password: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {showPassword ? (
                  <EyeOff
                    size={18}
                    onClick={() => setShowPassword(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  />
                ) : (
                  <Eye
                    size={18}
                    onClick={() => setShowPassword(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F97316] text-white py-2 rounded-lg hover:bg-[#F97340] transition"
            >
              Login
            </button>
          </form>
        )}

        {/* Email + OTP */}
        {loginMethod === "email-otp" && (
          <form onSubmit={handleEmailOtpLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={emailOtpLogin.email}
                  required
                  onChange={(e) =>
                    setEmailOtpLogin({
                      ...emailOtpLogin,
                      email: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-24 border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
                <button
                  disabled={!emailOtpLogin.email}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!emailOtpLogin.email) {
                      return toast.error("Please fill the email field");
                    }
                    dispatch(otpSent(emailOtpLogin.email));
                  }}
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-medium hover:underline cursor-pointer"
                >
                  Generate OTP
                </button>
              </div>
            </div>

            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="relative mt-1">
                {/* <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
                <SiAwssecretsmanager
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  value={emailOtpLogin.otp}
                  required
                  onChange={(e) =>
                    setEmailOtpLogin({
                      ...emailOtpLogin,
                      otp: e.target.value,
                    })
                  }
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="w-full pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white py-2 rounded-lg hover:bg-[#1E3A9C] transition"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
