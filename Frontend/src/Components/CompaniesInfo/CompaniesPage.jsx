// src/components/Companies/CompaniesPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompanies } from "../../../AllStateStore/CompanyInfo/CompanySlice";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, MapPin } from "lucide-react";

const CompaniesPage = () => {
  const dispatch = useDispatch();
  const { allCompany: companies, loading } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  if (loading) return <p className="text-center p-6">Loading companies...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <Building2 className="w-6 h-6 text-blue-600" />
        Explore Companies
      </h1>

      {companies.length === 0 ? (
        <p className="text-center text-gray-500">No companies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {companies &&
            companies?.map((company) => (
              <div
                key={company?._id}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white"
              >
                <div className="flex items-center gap-4">
                  {company?.companyLogo?.url ? (
                    <img
                      src={company?.companyLogo.url}
                      alt={company?.companyName}
                      className="w-16 h-16 object-cover rounded-full border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
                      {company?.companyName[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {company?.companyName}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> {company?.industry}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                  {company?.companyDescription || "No description available."}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {company?.location}
                  </span>
                  <Link
                    to={`/companies/${company?._id}`}
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    View Details <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
