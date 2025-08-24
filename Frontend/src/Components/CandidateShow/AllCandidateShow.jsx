import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCandidate } from "../../..//AllStateStore/CandidateShow/CandidateShowSlice";
import { Link } from "react-router-dom";
import { User, Star } from "lucide-react";

const AllCandidateShow = () => {
  const dispatch = useDispatch();
  const {
    allCandidate: candidates,
    loading,
    error,
  } = useSelector((state) => state.candidate);

  useEffect(() => {
    dispatch(getAllCandidate());
  }, [dispatch]);

  if (loading)
    return <p className="text-center mt-5 p-6">Loading suggestions...</p>;
  if (error) return <p className="text-center mt-5 p-6">{error}</p>;

  if (!candidates.length) {
    return (
      <p className="text-center mt-5 p-6">No matching candidates found yet.</p>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" /> Suggested Candidates For
        Recent Job Opnings
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {candidates.map((c) => (
          <div
            key={c._id}
            className="border rounded-xl p-4 shadow bg-white hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{c.fullName}</h3>
            <p className="text-gray-600">{c.email}</p>
            <p className="mt-2 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" /> {c.matchCount} skill
              matches
            </p>
            <p className="mt-2 flex items-center gap-1">
              Skills Match Percentage:{" "}
              <span className="text-indigo-500">{c?.matchPercentage}%</span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Matched Skills:</span>{" "}
              {c.matchedSkills.join(", ")}
            </p>

            <Link
              to={`/candidates/${c._id}`}
              className="mt-3 inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCandidateShow;
