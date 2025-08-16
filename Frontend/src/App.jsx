import "./App.css";
import Swal from "sweetalert2";
import deleteConfirm from "./General/DeleteConfirm";
import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import Navbar from "./General/Navbar";
import SignupPage from "./Components/AuthenticationPages/SignupPage";
import LoginPage from "./Components/AuthenticationPages/LoginPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./General/ProtectedRoutes";
import { useSelector } from "react-redux";
import JobseekerProfileShow from "./Components/UserProfile/JobseekerProfileShow";
import EmployerProfileShow from "./Components/UserProfile/EmployerProfileShow";
import CreateEmployeeProfile from "./Components/UserProfile/CreateJobSeekerProfile";
import CreateEmployerProfile from "./Components/UserProfile/CreateEmployerProfile";
function App() {
  const role =
    useSelector((state) => state.authentication.role) ||
    localStorage.getItem("role");
  return (
    <>
      <Navbar />
      {/* Main Content */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="container mx-auto mt-10 mb-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Profile Routes */}
          {/* View Profile (any) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                {role === "jobseeker" ? (
                  <JobseekerProfileShow />
                ) : (
                  <EmployerProfileShow />
                )}
              </ProtectedRoutes>
            }
          />{" "}
          {/* Create profile Any */}
          <Route
            path="/create-profile"
            element={
              <ProtectedRoutes>
                {role === "jobseeker" ? (
                  <CreateEmployeeProfile />
                ) : (
                  <CreateEmployerProfile />
                )}
              </ProtectedRoutes>
            }
          />
          {/* Edit Profile */}
          <Route
            path="/edit-profile/:id"
            element={
              <ProtectedRoutes>
                {role === "jobseeker" ? (
                  <CreateEmployeeProfile />
                ) : (
                  <CreateEmployerProfile />
                )}
              </ProtectedRoutes>
            }
          />
          <Route
            path="*"
            element={
              <div className="text-center font-bold text-4xl mt-40 mb-30 text-red-500">
                Page Not Found
              </div>
            }
          />
        </Routes>
      </div>
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          {/* Left */}
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Click2Hire. All rights reserved.
          </p>

          {/* Right */}
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              About Us{" "}
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
