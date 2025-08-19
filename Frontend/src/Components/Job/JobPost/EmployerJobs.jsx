import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyJobs,
  deleteJobPosting,
  closeJobPosting,
  createJobPosting,
  updateJobPosting,
} from "../../../../AllStateStore/Employer/JobPostSlice";
import Swal from "sweetalert2";
import JobForm from "./JobForm";
import { useNavigate } from "react-router-dom";

const EmployerJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useSelector((state) => state.employerJobPost);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  const handleDelete = async (jobId) => {
    dispatch(deleteJobPosting(jobId, navigate));
  };

  const handleClose = async (jobId) => {
    const confirm = await Swal.fire({
      title: "Close Job?",
      text: "This job will no longer accept applications.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it!",
    });
    if (confirm.isConfirmed) dispatch(closeJobPosting(jobId));
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmitJob = async (jobData) => {
    Swal.fire({
      title: editingJob ? "Updating Job..." : "Creating Job...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      if (editingJob) {
        await dispatch(updateJobPosting(editingJob._id, jobData));
        Swal.fire({ icon: "success", title: "Job updated successfully!" });
      } else {
        await dispatch(createJobPosting(jobData, navigate));
        Swal.fire({ icon: "success", title: "Job created successfully!" });
      }

      setShowForm(false);
      setEditingJob(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error || "Something went wrong.",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">My Job Postings</h2>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => {
            setEditingJob(null);
            setShowForm(!showForm);
            window.scrollTo(0, 0);
          }}
        >
          {showForm ? "Cancel" : "Create New Job"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow border">
          <JobForm
            onSubmit={handleSubmitJob}
            setShowForm={setShowForm}
            initialData={editingJob || {}}
          />
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center">
          No job postings found. Create your first job!
        </p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {jobs?.map((job) => (
            <div
              key={job._id}
              className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-2xl text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-500">{job.location}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === "Open"
                      ? "bg-green-100 text-green-800"
                      : job.status === "Closed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              {/* Job Details */}
              <div className="mt-3 space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Applications:</span>{" "}
                  {job.applicationCount}
                </p>
                {job.employmentType && (
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {job.employmentType}
                  </p>
                )}
                {job.remoteOption && (
                  <p>
                    <span className="font-medium">Remote:</span>{" "}
                    {job.remoteOption}
                  </p>
                )}
                {job.salaryRange && (
                  <p>
                    <span className="font-medium">Salary:</span>{" "}
                    {job.salaryRange.min} - {job.salaryRange.max}{" "}
                    {job.salaryRange.currency}
                  </p>
                )}
                {job.skillsRequired?.length > 0 && (
                  <p>
                    <span className="font-medium">Skills:</span>{" "}
                    {job.skillsRequired.join(", ")}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => navigate(`/post-job/${job._id}`)}
                >
                  View
                </button>
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                  onClick={() => navigate(`/post-job/${job._id}/applications/`)}
                >
                  Applications
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
                  onClick={() => handleClose(job._id)}
                  disabled={job?.status === "Closed"}
                >
                  Close
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  onClick={() => handleEdit(job)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;
