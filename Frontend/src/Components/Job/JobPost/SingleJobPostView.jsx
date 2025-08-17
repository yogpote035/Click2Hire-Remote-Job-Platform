import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import JobForm from "./JobForm"; // your form path
import {
  getJobById,
  deleteJobPosting,
  closeJobPosting,
  updateJobPosting, // you can reuse this for update
} from "../../../../AllStateStore/Employer/JobPostSlice";

const SingleJobView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { job, loading, error } = useSelector((state) => state.employerJobPost);
  const [editing, setEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(getJobById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error fetching job",
        text: error,
      });
    }
  }, [error]);

  const handleClose = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This job will be closed and not visible to applicants.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it!",
    });

    if (confirm.isConfirmed) {
      try {
        setActionLoading(true);
        await dispatch(closeJobPosting(job._id));
        Swal.fire("Closed!", "Job has been closed.", "success");
      } catch (err) {
        Swal.fire("Error", err || "Something went wrong.", "error");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDelete = async () => {
         try {
        setActionLoading(true);
        await dispatch(deleteJobPosting(job._id))
        Swal.fire("Deleted!", "Job has been deleted.", "success");
        navigate("/post-job");
      } catch (err) {
        Swal.fire("Error", err || "Something went wrong.", "error");
      } finally {
        setActionLoading(false);
      }
    
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      setActionLoading(true);
      // Use same createJobPosting action, send _id for update
      await dispatch(updateJobPosting( job._id, updatedData ));
      Swal.fire("Updated!", "Job has been updated successfully.", "success");
      setEditing(false);
    } catch (err) {
      Swal.fire("Error", err || "Something went wrong.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || actionLoading)
    return <p className="text-center mt-15 text-gray-500">Loading...</p>;
  if (!job) return <p className="text-center mt-15 text-gray-500">Job not found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {!editing ? (
        <>
          {/* Job Details */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
            <div className="flex gap-2 mt-2 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  job.status === "Open"
                    ? "bg-green-100 text-green-800"
                    : job.status === "Closed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {job.status}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-semibold">
                {job.employmentType}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
            <p><strong>Vacancies:</strong> {job.vacancies}</p>
            <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            <p><strong>Remote Option:</strong> {job.remoteOption}</p>
            <p><strong>Job Level:</strong> {job.jobLevel}</p>
            <p><strong>Work Schedule:</strong> {job.workSchedule}</p>
            <p><strong>Applications:</strong> {job.applicationCount}</p>
            <p><strong>Application Method:</strong> {job.applicationMethod}</p>
            <p><strong>Posted By:</strong> {job.postedBy}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          </div>

          {job.benefits?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{benefit}</span>
                ))}
              </div>
            </div>
          )}

          {job.companyPerks?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Company Perks</h3>
              <div className="flex flex-wrap gap-2">
                {job.companyPerks.map((perk, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{perk}</span>
                ))}
              </div>
            </div>
          )}

          {job.languagesRequired?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Languages Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.languagesRequired.map((lang, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{lang}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div className="flex justify-evenly gap-2 mt-6">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleClose} disabled={job.status === "Closed"}>Close</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setEditing(true)}>Edit</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>Delete</button>
          </div>
        </>
      ) : (
        // Show JobForm for editing
        <JobForm initialData={job} onSubmit={handleEditSubmit} />
      )}
    </div>
  );
};

export default SingleJobView;
