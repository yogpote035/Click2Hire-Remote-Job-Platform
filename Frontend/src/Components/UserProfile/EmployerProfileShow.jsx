import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getEmployerProfile,
  deleteEmployerProfile,
} from "../../../AllStateStore/Employer/EmployerProfileSlice";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
} from "lucide-react";

import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaReddit,
  FaMedium,
  FaDribbble,
  FaBehance,
  FaGlobe,
} from "react-icons/fa";
function EmployerProfileShow() {
  const id =
    useSelector((state) => state.authentication.user?.userId) ||
    localStorage.getItem("userId");

  const { loading, employer } = useSelector((state) => state.employerProfile);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getEmployerProfile(id));
    }
  }, [id, dispatch]);

  const profile = Array.isArray(employer) ? employer[0] : employer;

  const handleCreate = () => navigate(`/create-profile`);
  const handleEdit = () => navigate(`/edit-profile/${id}`);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl text-gray-500 animate-pulse">
        Loading Employer Profile...
      </div>
    );

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <FaLinkedin className="text-blue-600 text-xl mr-2" />;
      case "twitter":
        return <FaTwitter className="text-sky-500 text-xl mr-2" />;
      case "facebook":
        return <FaFacebook className="text-blue-500 text-xl mr-2" />;
      case "github":
        return <FaGithub className="text-gray-800 text-xl mr-2" />;
      case "instagram":
        return <FaInstagram className="text-pink-500 text-xl mr-2" />;
      case "youtube":
        return <FaYoutube className="text-red-600 text-xl mr-2" />;
      case "whatsapp":
        return <FaWhatsapp className="text-green-500 text-xl mr-2" />;
      case "telegram":
        return <FaTelegram className="text-sky-600 text-xl mr-2" />;
      case "reddit":
        return <FaReddit className="text-orange-500 text-xl mr-2" />;
      case "medium":
        return <FaMedium className="text-black text-xl mr-2" />;
      case "dribbble":
        return <FaDribbble className="text-pink-400 text-xl mr-2" />;
      case "behance":
        return <FaBehance className="text-blue-600 text-xl mr-2" />;
      case "website":
      case "portfolio":
      default:
        return <FaGlobe className="text-indigo-500 text-xl mr-2" />;
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-6 mb-15 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl">
       {profile ? (
        <div className="space-y-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={profile?.companyLogo}
              alt={profile?.companyName}
              className="w-32 h-32 rounded-full border-4 border-indigo-200 shadow-md object-cover"
            />
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Building2 className="text-indigo-600" /> {profile.companyName}
              </h2>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail size={18} className="text-indigo-500" /> {profile.email}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone size={18} className="text-indigo-500" />{" "}
                {profile.mobileNumber}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Globe size={18} className="text-indigo-500" />{" "}
                <a
                  href={profile?.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-indigo-600"
                >
                  {profile?.companyWebsite}
                </a>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-indigo-500" />{" "}
                {profile?.location}
              </p>
            </div>
          </div>

          {/* Job Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-gray-500 text-sm">Job Post Limit</h3>
              <p className="text-2xl font-bold text-indigo-700">
                {new Intl.NumberFormat("en-IN").format(
                  profile.jobPostLimit || 0
                )}
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-gray-500 text-sm">Active Job Posts</h3>
              <p className="text-2xl font-bold text-indigo-700">
                {profile.activeJobPosts}
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-gray-500 text-sm">Hiring Status</h3>
              <span
                className={`px-3 py-1 mt-2 inline-block text-sm font-semibold rounded-full text-white ${
                  profile.hiringStatus === "Hiring"
                    ? "bg-green-500"
                    : profile.hiringStatus === "On Hold"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {profile.hiringStatus}
              </span>
            </div>
          </div>

          {/* Company Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-xl shadow border">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <Briefcase className="text-indigo-600" /> Industry
              </h3>
              <p className="text-gray-600 mt-2">
                {profile.industry || "Not specified"}
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow border">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <Users className="text-indigo-600" /> Company Size
              </h3>
              <p className="text-gray-600 mt-2">
                {profile.companySize || "Not specified"}
              </p>
            </div>
          </div>

          {/* About Company */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <h3 className="font-semibold text-lg text-gray-800">
              About Company
            </h3>
            <p className="text-gray-600 mt-2">
              {profile.companyDescription || "No description provided."}
            </p>
          </div>

          {/* Social Links */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <h3 className="font-semibold text-lg text-gray-800">
              Social Links
            </h3>
            {profile.socialLinks?.length > 0 ? (
              <ul className="list-disc list-inside mt-2 space-y-1">
                {profile.socialLinks.map((link, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-700 hover:text-indigo-600 transition"
                  >
                    {getPlatformIcon(link.platform)}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">Not Provided</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 p-2 justify-center md:justify-start">
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => dispatch(deleteEmployerProfile(id, navigate))}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition"
            >
              Delete Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="mb-4 text-gray-500 text-lg">
            No employer profile found.
          </p>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
          >
            Create Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default EmployerProfileShow;
