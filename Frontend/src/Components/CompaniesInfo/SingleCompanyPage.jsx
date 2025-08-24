import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyById } from "../../../AllStateStore/CompanyInfo/CompanySlice";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Users,
  Briefcase,
  Target,
  CheckCircle,
  Mail,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

const SingleCompanyPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { company: singleCompany, loading } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    dispatch(getCompanyById(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center mt-4 p-6">Loading company...</p>;
  if (!singleCompany) return <p className="text-center mt-4">Company not found.</p>;

  return (
    <div className="container mx-auto p-6 mb-4 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-6">
        {singleCompany.companyLogo?.url && (
          <img
            src={singleCompany.companyLogo.url}
            alt={singleCompany.companyName}
            className="w-24 h-24 object-cover rounded-full border shadow-md"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{singleCompany.companyName}</h1>
          <p className="text-gray-600">{singleCompany.industry}</p>
          {singleCompany.companyWebsite && (
            <a
              href={singleCompany.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline mt-1"
            >
              <Globe className="w-4 h-4" /> {singleCompany.companyWebsite}
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">About Us</h2>
        <p className="text-gray-700 leading-relaxed">
          {singleCompany.companyDescription}
        </p>
      </div>

      {/* Company Info */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md grid sm:grid-cols-2 gap-6">
        <p className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Location:</span> {singleCompany.location}
        </p>
        <p className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Company Size:</span>{" "}
          {singleCompany.companySize}
        </p>
        <p className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Active Job Posts:</span>{" "}
          {singleCompany.activeJobPosts}
        </p>
        <p className="flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Job Post Limit:</span>{" "}
          {singleCompany.jobPostLimit}
        </p>
        <p className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="font-medium">Hiring Status:</span>{" "}
          {singleCompany.hiringStatus}
        </p>
        <p className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Contact Email:</span>{" "}
          {singleCompany.contactEmail}
        </p>
      </div>

      {/* Social Links */}
      {singleCompany.socialLinks?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Connect With Us</h2>
          <ul className="space-y-2">
            {singleCompany.socialLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  {link.platform === "Instagram" && (
                    <Instagram className="w-4 h-4 text-pink-500" />
                  )}
                  {link.platform === "LinkedIn" && (
                    <Linkedin className="w-4 h-4 text-blue-700" />
                  )}
                  {link.platform === "Twitter" && (
                    <Twitter className="w-4 h-4 text-sky-500" />
                  )}
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Employer Info */}
      {singleCompany.userId && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Employer Info</h2>
          <div className="bg-white p-4 rounded-lg border shadow-sm space-y-1">
            <p>👤 {singleCompany.userId.fullName}</p>
            <p>🏢 {singleCompany.userId.companyName}</p>
            <p>📧 {singleCompany.userId.email}</p>
            <p>📱 {singleCompany.userId.mobileNumber}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCompanyPage;
