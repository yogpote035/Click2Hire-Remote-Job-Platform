import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [activeButton, setActiveButton] = useState("login");
  let role = "jobseeker"; // "jobseeker" | "employer" | "admin"
  let isAuthenticated = false;

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    isAuthenticated = false;
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            <img src="/logo.png" className="h-13 w-13" alt="Logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
            <Link to="/jobs" className="hover:text-blue-500">
              Jobs
            </Link>
            <Link to="/companies" className="hover:text-blue-500">
              Companies
            </Link>

            {role === "employer" && (
              <Link to="/post-job" className="hover:text-blue-500">
                Post Job
              </Link>
            )}
            {role === "jobseeker" && (
              <Link to="/my-applications" className="hover:text-blue-500">
                My Applications
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setActiveButton("login")}
                  className={`border border-blue-600 text-blue-600 px-4 py-1.5 rounded hover:bg-blue-50 ${activeButton === "login" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                >
                  Login
                </Link>
                <Link
                  onClick={() => setActiveButton("signup")}
                  to="/signup"
                  className={`border border-blue-600 text-blue-600 px-4 py-1.5 rounded hover:bg-blue-50 ${activeButton === "signup" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="hover:text-blue-500">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-gray-600 focus:outline-none text-2xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Sidebar (Right Overlay, No Dark Screen) */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-3 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-blue-600">Menu</h2>
          <button
            className="text-gray-600 text-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="px-4 py-4 space-y-4">
          <Link
            to="/"
            className="block hover:text-blue-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className="block hover:text-blue-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            Jobs
          </Link>
          <Link
            to="/companies"
            className="block hover:text-blue-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            Companies
          </Link>

          {role === "employer" && (
            <Link
              to="/post-job"
              className="block hover:text-blue-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              Post Job
            </Link>
          )}
          {role === "jobseeker" && (
            <Link
              to="/my-applications"
              className="block hover:text-blue-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              My Applications
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="block bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block border border-blue-600 text-blue-600 px-4 py-1.5 rounded hover:bg-blue-50"
                onClick={() => setIsSidebarOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="block bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
