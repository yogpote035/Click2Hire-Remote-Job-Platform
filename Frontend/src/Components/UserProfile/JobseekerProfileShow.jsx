import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeeProfile,
  deleteEmployeeProfile,
} from "../../../AllStateStore/JobSeeker/JobSeekerProfileSlice";
import { Briefcase, MapPin, Phone, Mail } from "lucide-react";

function JobSeekerProfileShow() {
  const id =
    useSelector((state) => state.authentication.user?.userId) ||
    localStorage.getItem("userId");
  const navigate = useNavigate();

  const { loading, jobseeker, error } = useSelector(
    (state) => state.jobseekerProfile
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeProfile(id));
    }
  }, [id]);

  const handleCreate = () => navigate(`/create-profile`);
  const handleEdit = () => navigate(`/edit-profile/${id}`);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  return (
    <div className="max-w-5xl mx-auto p-8 mt-25 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200">
      <h1 className="text-blue-600 text-center font-extrabold text-4xl mb-10">
        Job Seeker Profile
      </h1>

      {jobseeker ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-6">
            <img
              src={jobseeker.profilePicture || "/default-avatar.png"}
              alt={jobseeker.fullName}
              className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-blue-200"
            />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {jobseeker.fullName}
              </h2>
              <div className="mt-2 space-y-1 text-gray-600">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={18} className="text-blue-500" /> {jobseeker.email}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <Phone size={18} className="text-blue-500" />{" "}
                  {jobseeker.mobileNumber}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={18} className="text-blue-500" />{" "}
                  {jobseeker.location}
                </p>
              </div>
              <p className="mt-4 text-sm bg-blue-50 inline-block px-4 py-1 rounded-full text-blue-600 font-medium">
                Availability: {jobseeker.availability}
              </p>
              <p className="mt-2 font-semibold text-gray-700">
                Expected Salary:{" "}
                <span className="text-green-600">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(jobseeker?.expectedSalary || 0)}{" "}
                </span>
              </p>
            </div>
          </div>

          {/* About */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3 mb-3">
              About Me
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {jobseeker.about || "Not Provided"}
            </p>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3 mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobseeker.skills?.length ? (
                jobseeker.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Not Provided</p>
              )}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3 mb-3">
              Education
            </h3>
            {jobseeker.education?.length ? (
              <ul className="space-y-2">
                {jobseeker.education.map((edu, i) => (
                  <li
                    key={i}
                    className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition"
                  >
                    <p className="font-bold text-gray-700">{edu.degree}</p>
                    <p className="text-gray-600">
                      {edu.institution} ({edu.year}) • CGPA: {edu.CGPA}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Not Provided</p>
            )}
          </section>

          {/* Projects */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3 mb-3">
              Projects
            </h3>
            {jobseeker.projects?.length ? (
              <ul className="space-y-3">
                {jobseeker.projects.map((pr, i) => (
                  <li
                    key={i}
                    className="bg-gray-50 p-5 rounded-lg border hover:shadow-md transition"
                  >
                    <p className="font-bold text-lg text-gray-800">
                      {pr.title}
                    </p>
                    <p className="text-gray-600">{pr.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Skills: {pr.skills?.join(", ")} | Tech:{" "}
                      {pr.technologies?.join(", ")}
                    </p>
                    <p className="text-sm mt-1">
                      🔗{" "}
                      <a
                        href={pr.sourceCode}
                        className="text-blue-600 hover:underline"
                      >
                        Source
                      </a>{" "}
                      |{" "}
                      <a
                        href={pr.liveUrl}
                        className="text-green-600 hover:underline"
                      >
                        Live
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Not Provided</p>
            )}
          </section>

          {/* Buttons */}
          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                dispatch(deleteEmployeeProfile(id, navigate));
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              Delete Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="mb-4 text-gray-600">No profile found.</p>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Create Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default JobSeekerProfileShow;
