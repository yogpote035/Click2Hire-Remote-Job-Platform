import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getApplication,
  deleteApplication,
  downloadApplication,
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
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Loading application...
      </p>
    );
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!application)
    return (
      <p className="text-center mt-20 text-gray-500">Application not found.</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 mb-10 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Application Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Review your submitted application
          </p>
        </div>
        <span
          className={`inline-block px-4 py-1 rounded-full text-sm font-medium shadow-sm ${
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

      {/* Job Info */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800">
          {application.jobPostId?.title}
        </h3>
        <p className="text-gray-600">{application.jobPostId?.location}</p>
        <p className="text-gray-500 text-sm mt-1">
          {application.jobPostId?.employmentType} •{" "}
          {application.jobPostId?.experienceLevel}
        </p>
      </div>

      {/* Candidate Info */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Candidate Information
        </h3>
        <div className="flex items-center gap-5 mb-4 p-4 bg-gray-50 rounded-xl">
          <img
            src={application.userProfileId?.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover shadow"
          />
          <div>
            <p className="font-medium text-lg text-gray-800">
              {application.userProfileId?.fullName}
            </p>
            <p className="text-gray-600 text-sm">
              {application.userProfileId?.email} |{" "}
              {application.userProfileId?.mobileNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-medium">Location:</span>{" "}
            {application.userProfileId?.location}
          </p>
          <p>
            <span className="font-medium">Skills:</span>{" "}
            {application.userProfileId?.skills?.join(", ")}
          </p>
          <p>
            <span className="font-medium">Education:</span>{" "}
            {application.userProfileId?.education?.[0]?.degree} @{" "}
            {application.userProfileId?.education?.[0]?.institution} <br />{" "}
            Year: {application.userProfileId?.education?.[0]?.year}
          </p>
          <p>
            <span className="font-medium">Expected Salary:</span> ₹
            {application.userProfileId?.expectedSalary?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Documents</h3>
        <div className="space-y-2">
          <a
            href={application.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 hover:underline"
          >
            📄 View Resume
          </a>
          <br />
          <a
            href={application.coverLetter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 hover:underline"
          >
            📝 View Cover Letter
          </a>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              dispatch(downloadApplication(application._id));
            }}
            className="bg-orange-500 hover:bg-orange-600 transition px-5 py-2 rounded-lg text-white font-medium shadow"
          >
            ⬇️ Download Application
          </button>
          <button
            onClick={() => {
              dispatch(
                deleteApplication(
                  application._id,
                  application.jobPostId._id,
                  navigate
                )
              );
            }}
            className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-lg text-white font-medium shadow"
          >
            ❌ Withdraw Application
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm border-t pt-4">
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
