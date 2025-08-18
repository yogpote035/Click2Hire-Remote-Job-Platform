import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getSingleApplicationForJob,
  ChangeApplicationStatus,
} from "../../../../AllStateStore/Employer/JobPostSlice";

export default function SingleJobApplicationView() {
  const { id, profileId } = useParams();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.employerJobPost);

  const applications = useSelector(
    (state) => state.employerJobPost.allApplication
  );

  const application = Array.isArray(applications)
    ? applications[0]
    : applications;

  useEffect(() => {
    if (id && profileId) {
      dispatch(getSingleApplicationForJob(id, profileId));
    }
  }, [dispatch, id, profileId]);

  const handleStatusChange = (newStatus) => {
    dispatch(ChangeApplicationStatus(application?._id, profileId, newStatus));
  };

  const profile = application?.userProfileId;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {loading && <p className="text-blue-500">Loading application...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {application && profile && (
        <div className="bg-white shadow rounded-xl p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <img
              src={profile.profilePicture}
              alt={profile.fullName}
              className="w-30 h-35 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{profile.fullName}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-500 text-sm">{profile.mobileNumber}</p>
            </div>
          </div>

          {/* Application Meta */}
          <p className="text-sm text-gray-500 mt-2">
            Applied on {new Date(application.appliedAt).toLocaleDateString()}
          </p>

          {/* Job Info */}
          <div className="mt-4">
            <h3 className="font-semibold">Job Applied</h3>
            <p>{application.jobPostId?.title || "N/A"}</p>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <h3 className="font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-sm bg-gray-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mt-4">
            <h3 className="font-semibold">Experience</h3>
            <p className="text-gray-700">{profile.experience}</p>
          </div>

          {/* Projects */}
          <div className="mt-4">
            <h3 className="font-semibold">Projects</h3>
            <div className="space-y-3">
              {profile?.projects?.map((proj) => (
                <div
                  key={proj._id}
                  className="border p-3 rounded-lg bg-gray-50"
                >
                  <h4 className="font-semibold">{proj.title}</h4>
                  <p className="text-sm text-gray-600">{proj.description}</p>
                  <div className="text-sm mt-1">
                    <a
                      href={proj.sourceCode}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline mr-3"
                    >
                      Source
                    </a>
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Live
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mt-4">
            <h3 className="font-semibold">Education</h3>
            {profile?.education?.map((edu) => (
              <p key={edu._id} className="text-gray-700">
                {edu.degree} – {edu.institution} ({edu.year}), CGPA: {edu.CGPA}
              </p>
            ))}
          </div>

          {/* Certifications */}
          {profile?.certifications?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Certifications</h3>
              <ul className="list-disc list-inside text-gray-700">
                {profile?.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="mt-4 flex flex-wrap gap-4">
            {profile?.linkedinProfile && (
              <a
                href={profile?.linkedinProfile}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600  hover:underline"
              >
                LinkedIn
              </a>
            )}
            {profile?.githubProfile && (
              <a
                href={profile?.githubProfile}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600  hover:underline"
              >
                GitHub
              </a>
            )}
            {profile?.portfolioUrl && (
              <a
                href={profile?.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600  hover:underline"
              >
                Portfolio
              </a>
            )}
          </div>

          {/* Resume & Cover Letter */}
          <div className="mt-4 flex gap-4">
            <a
              href={application?.resume}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>
            <a
              href={application?.coverLetter}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600  hover:underline"
            >
              View Cover Letter
            </a>
          </div>

          {/* Status */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Application Status</h3>

            {/* Current Status Badge */}
            <p
              className={`inline-block mt-2 px-4 py-2 text-sm font-medium rounded-full shadow-sm transition 
      ${
        application.status === "Applied"
          ? "bg-blue-100 text-blue-700 border border-blue-300"
          : application.status === "Under Review"
          ? "bg-purple-100 text-purple-700 border border-purple-300"
          : application.status === "Shortlisted"
          ? "bg-green-100 text-green-700 border border-green-300"
          : application.status === "Interview"
          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
          : application.status === "Offered"
          ? "bg-orange-100 text-orange-700 border border-orange-300"
          : application.status === "Rejected"
          ? "bg-red-100 text-red-700 border border-red-300"
          : "bg-gray-100 text-gray-600 border border-gray-300"
      }`}
            >
              {application.status}
            </p>

            <h1 className="text-indigo-600 font-bold mt-6 text-lg">
              Change Application Status
            </h1>

            {/* Buttons Grid */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                onClick={() => handleStatusChange("Under Review")}
                className={`px-4 py-2 rounded-lg text-white font-medium transition shadow-sm
        ${
          application.status === "Under Review"
            ? "bg-purple-700"
            : "bg-purple-500 hover:bg-purple-600"
        }`}
              >
                Under Review
              </button>

              <button
                onClick={() => handleStatusChange("Shortlisted")}
                className={`px-4 py-2 rounded-lg text-white font-medium transition shadow-sm
        ${
          application.status === "Shortlisted"
            ? "bg-green-700"
            : "bg-green-500 hover:bg-green-600"
        }`}
              >
                Shortlisted
              </button>

              <button
                onClick={() => handleStatusChange("Interview")}
                className={`px-4 py-2 rounded-lg text-white font-medium transition shadow-sm
        ${
          application.status === "Interview"
            ? "bg-yellow-700"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
              >
                Interview
              </button>

              <button
                onClick={() => handleStatusChange("Offered")}
                className={`px-4 py-2 rounded-lg text-white font-medium transition shadow-sm
        ${
          application.status === "Offered"
            ? "bg-orange-700"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
              >
                Offer
              </button>

              <button
                onClick={() => handleStatusChange("Rejected")}
                className={`px-4 py-2 rounded-lg text-white font-medium transition shadow-sm
        ${
          application.status === "Rejected"
            ? "bg-red-700"
            : "bg-red-500 hover:bg-red-600"
        }`}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
