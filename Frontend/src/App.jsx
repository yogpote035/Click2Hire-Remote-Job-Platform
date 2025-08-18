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
import EmployerJobs from "./Components/Job/JobPost/EmployerJobs";
import AllJobsForSeeker from "./Components/Job/AllJobs";
import SingleJobView from "./Components/Job/SingleJobView";
import ApplyJobPage from "./Components/Job/ApplyJob/ApplyJobPage";
import MyApplicationsPage from "./Components/Job/ApplyJob/MyApplicationsPage";
import SingleApplicationPage from "./Components/Job/ApplyJob/SingleApplicationPage";
import SingleJobPostView from "./Components/Job/JobPost/SingleJobPostView";
import JobApplicationsList from "./Components/Job/JobPost/JobApplicationsList";
import SingleJobApplicationView from "./Components/Job/JobPost/SingleJobApplicationView";
function App() {
  const role =
    useSelector((state) => state.authentication.role) ||
    localStorage.getItem("role");
  return (
    <>
      <Navbar />
      {/* Main Content */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          top: 80,
        }}
      />

      <div className="container mx-auto mt-10 py-10 pb-12 mb-5">
        <Routes>
          {/* update this page later */}
          <Route path="/" element={<HomePage />} />
          {/* Authentication */}
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
          {/* Job Route Show And ... */}
          <Route path="/jobs" element={<AllJobsForSeeker />} />
          <Route path="/job/:id" element={<SingleJobView />} />
          {/* Apply Job Routes */}
          <Route
            path="/apply-job/:id"
            element={
              <ProtectedRoutes>
                <ApplyJobPage />
              </ProtectedRoutes>
            }
          />
          {/* my all application */}
          <Route
            path="/my-applications"
            element={
              <ProtectedRoutes>
                <MyApplicationsPage />
              </ProtectedRoutes>
            }
          />
          {/* my single application */}
          <Route
            path="/my-application/:id"
            element={
              <ProtectedRoutes>
                <SingleApplicationPage />
              </ProtectedRoutes>
            }
          />
          {/* Job Post Routes */}
          {role === "employer" && (
            <Route
              path="post-job"
              element={
                <ProtectedRoutes>
                  <EmployerJobs />
                </ProtectedRoutes>
              }
            />
          )}
          {/* single job post */}
          {role === "employer" && (
            <Route
              path="/post-job/:id"
              element={
                <ProtectedRoutes>
                  <SingleJobPostView />
                </ProtectedRoutes>
              }
            />
          )}
          {/* All Application For a job */}
          {role === "employer" && (
            <Route
              path="/post-job/:id/applications/"
              element={
                <ProtectedRoutes>
                  <JobApplicationsList />
                </ProtectedRoutes>
              }
            />
          )}
          {/* Single  Application For a job */}
          {role === "employer" && (
            <Route
              path="/post-job/:id/applications/:profileId"
              element={
                <ProtectedRoutes>
                  <SingleJobApplicationView />
                </ProtectedRoutes>
              }
            />
          )}
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
      <footer className="bg-gray-50 border-t fixed bottom-0 left-0 w-full border-gray-200 py-6 mt-12">
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
