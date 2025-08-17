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

export const { requestStart, requestSuccess, requestFail, clearJobState } =
  employerJobSlice.actions;

export default employerJobSlice.reducer;

// Create Job Posting
export const createJobPosting =
  (jobData) => async (dispatch, getState) => {
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
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// Fetch Employer’s Jobs
export const getMyJobs = () => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Wait!!, Fetching Your Jobs...",
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
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(requestSuccess(data));
  } catch (error) {
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Update Job
export const updateJobPosting =
  (id, jobData) => async (dispatch, getState) => {
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
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// Delete Job
export const deleteJobPosting = (id) => async (dispatch, getState) => {
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
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Close Job (mark as Closed)
export const closeJobPosting = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/${id}/close`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(requestSuccess(data.job));
    toast.success("Job closed successfully!");
    dispatch(getMyJobs());
  } catch (error) {
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
