import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  scanResume,
  clearResumeFeedback,
} from "../../../AllStateStore/Resume/resumeSlice";

export default function GetResumeFeedback() {
  const dispatch = useDispatch();
  const { success, error, loading, resumeFeedback } = useSelector(
    (state) => state.resume
  );
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a Resume File");
    dispatch(scanResume(file)); // pass file directly
  };

  const handleReset = () => {
    setFile(null);
    dispatch(clearResumeFeedback());
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📄 Resume Scanner & AI Feedback
      </h1>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4 border"
      >
        <label className="block text-lg font-medium text-gray-700">
          Upload Resume
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0] || null)}
          className="block w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "⏳ Scanning..." : "🚀 Scan Resume"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-lg border border-gray-400 hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            🔄 Reset
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg border border-red-300 flex items-center ">
          <span className="text-2xl mb-2 pr-2">⚠️</span> {" "}{error}
        </div>
      )}

      {/* Feedback Display */}
      {success && resumeFeedback?.feedback && (
        <div className="mt-6 bg-white shadow-md border rounded-2xl p-6 space-y-5">
          {/* Score */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Overall Score
            </h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-semibold rounded-lg">
              {resumeFeedback.feedback.overallScore}/10
            </span>
          </div>

          {/* Summary */}
          <p className="text-gray-700 leading-relaxed">
            {resumeFeedback.feedback.summary}
          </p>

          {/* Strengths */}
          {resumeFeedback.feedback.strengths?.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-700 text-lg">
                ✅ Strengths
              </h3>
              <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
                {resumeFeedback.feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {resumeFeedback.feedback.issues?.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 text-lg">⚠️ Issues</h3>
              <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
                {resumeFeedback.feedback.issues.map((it, i) => (
                  <li key={i}>
                    <span className="font-medium capitalize">{it.type}:</span>{" "}
                    {it.note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Checklist */}
          {resumeFeedback.feedback.actionChecklist?.length > 0 && (
            <div>
              <h3 className="font-semibold text-indigo-700 text-lg">
                📌 Actionable Checklist
              </h3>
              <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
                {resumeFeedback.feedback.actionChecklist.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
