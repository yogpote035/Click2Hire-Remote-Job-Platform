import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  User,
  FileText,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Award,
  GraduationCap,
  Briefcase,
  Languages,
} from "lucide-react";
import { getCandidateById } from "../../../AllStateStore/CandidateShow/CandidateShowSlice";

const SingleCandidateShow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { candidate, loading, error } = useSelector((state) => state.candidate);

  useEffect(() => {
    dispatch(getCandidateById(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center p-6">Loading candidate...</p>;
  if (error) return <p className="text-center mt-5 p-6">{error}</p>;

  if (!candidate) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Candidate not found.</p>
        <Link to={-1} className="text-blue-600 hover:underline mt-4 block">
          ← Back to candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Button */}
      {/* <Link
        to={-1}
        className="text-blue-600 hover:underline flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link> */}

      <div className="border rounded-2xl p-6 shadow bg-white">
        {/* Header */}
        <div className="flex items-center gap-6 mb-6">
          {candidate.profilePicture?.url && (
            <img
              src={candidate.profilePicture.url}
              alt={candidate.fullName}
              className="w-24 h-24 rounded-full object-cover border"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
              <User className="w-6 h-6 text-blue-600" /> {candidate.fullName}
            </h2>
            <p className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4" /> {candidate.email}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" /> {candidate.mobileNumber}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4" /> {candidate.location}
            </p>
          </div>
        </div>

        {/* About */}
        {candidate.about && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">About</h3>
            <p className="text-gray-700">{candidate.about}</p>
          </div>
        )}

        {/* Skills */}
        {candidate.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {candidate.education?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" /> Education
            </h3>
            <ul className="list-disc pl-6 text-gray-700">
              {candidate.education.map((edu) => (
                <li key={edu._id}>
                  <strong>{edu.degree}</strong> - {edu.institution} ({edu.year})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects */}
        {candidate.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" /> Projects
            </h3>
            <ul className="space-y-3">
              {candidate.projects.map((proj) => (
                <li
                  key={proj._id}
                  className="p-3 border rounded-lg bg-gray-50 shadow-sm"
                >
                  <h4 className="font-semibold">{proj.title}</h4>
                  <p className="text-sm text-gray-700">{proj.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    {proj.sourceCode && (
                      <a
                        href={proj.sourceCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Source Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {candidate.certifications?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" /> Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {candidate.languages?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Languages className="w-5 h-5 text-pink-600" /> Languages
            </h3>
            <p className="text-gray-700">{candidate.languages.join(", ")}</p>
          </div>
        )}

        {/* Salary */}
        {candidate.expectedSalary && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-1">Expected Salary</h3>
            <p className="text-gray-800 font-medium">
              ₹ {candidate.expectedSalary.toLocaleString()}
            </p>
          </div>
        )}

        {/* Resume + Social Links */}
        <div className="flex flex-wrap gap-4 mt-6">
          {candidate.resumeUrl?.url && (
            <a
              href={candidate.resumeUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <FileText className="w-4 h-4" /> View Resume
            </a>
          )}
          {candidate.githubProfile && (
            <a
              href={candidate.githubProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-800 hover:underline"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}
          {candidate.linkedinProfile && (
            <a
              href={candidate.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-700 hover:underline"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCandidateShow;
