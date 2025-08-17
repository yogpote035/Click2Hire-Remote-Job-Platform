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
    dispatch(deleteJobPosting(jobId));
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
        await dispatch(updateJobPosting( editingJob._id, jobData ))
        Swal.fire({ icon: "success", title: "Job updated successfully!" });
      } else {
        await dispatch(createJobPosting(jobData))
        Swal.fire({ icon: "success", title: "Job created successfully!" });
      }

      setShowForm(false);
      setEditingJob(null);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error!", text: error || "Something went wrong." });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-2">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Job Postings</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700 transition"
        onClick={() => {
          setEditingJob(null);
          setShowForm(!showForm);
          window.scrollTo(0, 0);
        }}
      >
        {showForm ? "Cancel" : "Create New Job"}
      </button>

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded shadow border">
          <JobForm onSubmit={handleSubmitJob} initialData={editingJob || {}} />
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No job postings found. Create your first job!</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs?.map((job) => (
            <div
              key={job._id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-xl text-gray-800">{job.title}</h3>
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
                </div>
                <p className="text-gray-600">{job.location}</p>
                <p className="text-gray-600">Applications: {job.applicationCount}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  onClick={() => navigate(`/post-job/${job._id}`)}
                >
                  View
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  onClick={() => handleClose(job._id)}
                  disabled={job?.status === "Closed"}
                >
                  Close
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  onClick={() => handleEdit(job)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
