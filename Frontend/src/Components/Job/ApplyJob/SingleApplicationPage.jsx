import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getApplication,
  deleteApplication,
} from "../../../../AllStateStore/JobSeeker/JobApplicationSlice";

const SingleApplicationPage = () => {
  const { id } = useParams(); // applicationId from URL
  const dispatch = useDispatch();
  const { application, loading, error } = useSelector(
    (state) => state.jobseekerApplyJob
  );
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getApplication(id));
  }, [dispatch, id]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500">Loading application...</p>
    );
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!application)
    return (
      <p className="text-center mt-20 text-gray-500">Application not found.</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6  bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Application Details</h2>

      {/* Job Info */}
      <div className="mb-8 border-b pb-4">
        <h3 className="text-xl font-semibold">
          {application.jobPostId?.title}
        </h3>
        <p className="text-gray-600">{application.jobPostId?.location}</p>
        <p className="text-gray-500 text-sm">
          {application.jobPostId?.employmentType} •{" "}
          {application.jobPostId?.experienceLevel}
        </p>
        <span
          className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${
            application.status === "Applied"
              ? "bg-blue-100 text-blue-700"
              : application.status === "Under Review"
              ? "bg-yellow-100 text-yellow-700"
              : application.status === "Shortlisted"
              ? "bg-green-100 text-green-700"
              : application.status === "Interview"
              ? "bg-purple-100 text-purple-700"
              : application.status === "Offered"
              ? "bg-teal-100 text-teal-700"
              : application.status === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {application.status}
        </span>
      </div>

      {/* Job Seeker Info */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Candidate Information</h3>
        <div className="flex items-center gap-4 mb-3">
          <img
            src={application.userProfileId?.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{application.userProfileId?.fullName}</p>
            <p className="text-gray-600 text-sm">
              {application.userProfileId?.email} |{" "}
              {application.userProfileId?.mobileNumber}
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-2">
          <span className="font-medium">Location:</span>{" "}
          {application.userProfileId?.location}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Skills:</span>{" "}
          {application.userProfileId?.skills?.join(", ")}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Education:</span>{" "}
          {application.userProfileId?.education?.[0]?.degree} @{" "}
          {application.userProfileId?.education?.[0]?.institution}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Expected Salary:</span> ₹
          {application.userProfileId?.expectedSalary?.toLocaleString()}
        </p>
      </div>

      {/* Resume & Cover Letter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        <div className="space-y-2">
          <a
            href={application.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            📄 View Resume
          </a>
          <br />
          <a
            href={application.coverLetter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            📝 View Cover Letter
          </a>
          <div className="flex justify-center">
            <button
              onClick={() => {
                dispatch(deleteApplication(application._id, navigate));
              }}
              className="bg-red-500 hover:bg-red-600 p-2 px-4 rounded block text-white"
            >
              Withdraw Application
            </button>
          </div>
        </div>
      </div>

      {/* Applied Date */}
      <p className="text-gray-500 text-sm">
        Applied on{" "}
        {new Date(application.appliedAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};

export default SingleApplicationPage;
