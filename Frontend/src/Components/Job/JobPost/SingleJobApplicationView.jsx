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

  const profile = application?.userProfileId;

  useEffect(() => {
    if (id && profileId) {
      dispatch(getSingleApplicationForJob(id, profileId));
    }
  }, [dispatch, id, profileId]);

  const handleStatusChange = (newStatus) => {
    dispatch(ChangeApplicationStatus(application?._id, profileId, newStatus));
  };
  // ✅ Define a fixed mapping of status to class names
  const statusStyles = {
    Applied: "bg-blue-200 text-blue-700 border border-blue-300",
    "Under Review": "bg-purple-200 text-purple-700 border border-purple-300",
    Shortlisted: "bg-green-200 text-green-700 border border-green-300",
    Interview: "bg-yellow-200 text-yellow-700 border border-yellow-300",
    Offered: "bg-orange-200 text-orange-700 border border-orange-300",
    Rejected: "bg-red-200 text-red-700 border border-red-300",
    Default: "bg-gray-200 text-gray-600 border border-gray-300",
  };

  const buttonStyles = {
    "Under Review": {
      active: "bg-purple-700",
      inactive: "bg-purple-500 hover:bg-purple-600",
    },
    Shortlisted: {
      active: "bg-green-700",
      inactive: "bg-green-500 hover:bg-green-600",
    },
    Interview: {
      active: "bg-yellow-700",
      inactive: "bg-yellow-500 hover:bg-yellow-600",
    },
    Offered: {
      active: "bg-orange-700",
      inactive: "bg-orange-500 hover:bg-orange-600",
    },
    Rejected: {
      active: "bg-red-700",
      inactive: "bg-red-500 hover:bg-red-600",
    },
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {loading && <p className="text-blue-500">Loading application...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {application && profile && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-6">
            <img
              src={profile.profilePicture}
              alt={profile.fullName}
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {profile.fullName}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-500 text-sm">{profile.mobileNumber}</p>
              <p className="text-xs text-gray-400 mt-1">
                Applied on{" "}
                {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Job Info */}
          <div>
            <h3 className="font-semibold text-lg text-gray-700">Job Applied</h3>
            <p className="text-gray-800">
              {application.jobPostId?.title || "N/A"}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-lg text-gray-700">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="font-semibold text-lg text-gray-700">Experience</h3>
            <p className="text-gray-700 mt-1">{profile.experience}</p>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-semibold text-lg text-gray-700">Projects</h3>
            <div className="space-y-4 mt-2">
              {profile?.projects?.map((proj) => (
                <div
                  key={proj._id}
                  className="border p-4 rounded-lg bg-gray-50 hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-gray-800">{proj.title}</h4>
                  <p className="text-sm text-gray-600">{proj.description}</p>
                  <div className="text-sm mt-2 flex gap-4">
                    <a
                      href={proj.sourceCode}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 underline"
                    >
                      Source
                    </a>
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 underline"
                    >
                      Live
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-semibold text-lg text-gray-700">Education</h3>
            <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
              {profile?.education?.map((edu) => (
                <li key={edu._id}>
                  {edu.degree} – {edu.institution} ({edu.year}), CGPA:{" "}
                  {edu.CGPA}
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          {profile?.certifications?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-gray-700">
                Certifications
              </h3>
              <ul className="list-disc ml-6 text-gray-700 mt-2 space-y-1">
                {profile.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {profile?.linkedinProfile && (
              <a
                href={profile.linkedinProfile}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 font-medium hover:underline"
              >
                LinkedIn
              </a>
            )}
            {profile?.githubProfile && (
              <a
                href={profile.githubProfile}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 font-medium hover:underline"
              >
                GitHub
              </a>
            )}
            {profile?.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 font-medium hover:underline"
              >
                Portfolio
              </a>
            )}
          </div>

          {/* Resume & Cover Letter */}
          <div className="flex gap-6">
            <a
              href={application?.resume}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline"
            >
              View Resume
            </a>
            <a
              href={application?.coverLetter}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline"
            >
              View Cover Letter
            </a>
          </div>

          {/* Status */}
          {/* Status */}
          <div>
            <h3 className="font-semibold text-lg text-gray-700">
              Application Status
            </h3>

            <p
              className={`inline-block mt-2 px-4 py-2 text-sm font-medium rounded-full shadow-sm ${
                statusStyles[application.status] || statusStyles.Default
              }`}
            >
              {application.status}
            </p>

            <h4 className="text-indigo-600 font-bold mt-6 text-lg">
              Change Application Status
            </h4>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.keys(buttonStyles).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition shadow-sm ${
                    application.status === status
                      ? buttonStyles[status].active
                      : buttonStyles[status].inactive
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
