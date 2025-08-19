import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import deleteConfirm from "../../src/General/DeleteConfirm";

const initialState = {
  loading: false,
  success: false,
  error: null,
  jobs: [], // all posted jobs of employer
  job: null, // single job
  allApplication: [],
};

const employerJobSlice = createSlice({
  name: "employerJobs",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    requestSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      if (Array.isArray(action.payload)) {
        state.jobs = action.payload; // all jobs
      } else {
        state.job = action.payload; // single or updated job
      }
    },
    allApplicationSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.allApplication = action.payload; // single or multiple
    },
    requestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    clearJobState: (state) => {
      state.job = null;
      state.jobs = [];
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  requestSuccess,
  allApplicationSuccess,
  requestFail,
  clearJobState,
} = employerJobSlice.actions;

export default employerJobSlice.reducer;

// Create Job Posting
export const createJobPosting = (jobData) => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Wait!!, Creating Job...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/`,
      jobData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.close();
    dispatch(requestSuccess(data.job));
    toast.success("Job posted successfully!");
    dispatch(getMyJobs()); // refresh list
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Fetch Employer’s Jobs
export const getMyJobs = () => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Wait!!, Searching Your Job Posts...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/my-jobs`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.close();
    dispatch(requestSuccess(data));
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Fetch Single Job
export const getJobById = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Wait!!, Searching for job...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(requestSuccess(data));
    Swal.close();
    dispatch(getMyJobs());
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Update Job
export const updateJobPosting = (id, jobData) => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Wait!!, Updating Job...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/${id}`,
      jobData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.close();
    dispatch(requestSuccess(data.job));
    toast.success("Job updated successfully!");
    dispatch(getMyJobs());
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Delete Job
export const deleteJobPosting =
  (id, navigate) => async (dispatch, getState) => {
    const confirm = await deleteConfirm(
      "Delete Job?",
      "Are you sure? This action cannot be undone."
    );
    if (!confirm) return;

    dispatch(requestStart());
    Swal.fire({
      title: "Wait!!, Deleting Job...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const token =
        getState().authentication.token || localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/employer/job-post/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.close();
      toast.success("Job deleted successfully!");
      dispatch(getMyJobs()); // refresh list
      navigate("/post-job");
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// Close Job (mark as Closed)
export const closeJobPosting = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    Swal.fire({
      title: "Wait!!, Closing Your Job Post...",
      text: "You don't Receive Any Application Further..",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/${id}/close`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(requestSuccess(data.job));
    Swal.close();
    toast.success("Job closed successfully!");
    dispatch(getMyJobs());
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// All Application For a job
export const getAllApplicationsForJob = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    Swal.fire({
      title: "Wait!!, Searching All Job Application...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_API
      }/employer/job-post/all-application/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(allApplicationSuccess(data));
    Swal.close();
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
// Close Job (mark as Closed)
export const getSingleApplicationForJob =
  (id, profileId) => async (dispatch, getState) => {
    dispatch(requestStart());
    Swal.fire({
      title: "Wait!!, Searching Job Application...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const token =
        getState().authentication.token || localStorage.getItem("token");

      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/employer/job-post/single-application/${id}/${profileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(allApplicationSuccess(data));
      Swal.close();
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// For Change application Status like under review shortlist interviewed ....
export const ChangeApplicationStatus =
  (id, profileId, status) => async (dispatch, getState) => {
    dispatch(requestStart());
    try {
      Swal.fire({
        title: "Wait!!, Application Status is Being Update...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const token =
        getState().authentication.token || localStorage.getItem("token");

      const { data } = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_API
        }/employer/job-post/single-application/update-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(allApplicationSuccess(data?.application));
      toast.success(`Application Status Changed to: ${status}`);
      Swal.close();
      dispatch(getMyJobs());
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };
