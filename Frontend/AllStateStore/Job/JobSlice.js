// redux/slices/jobApplicationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import deleteConfirm from "../../src/General/DeleteConfirm";

const initialState = {
  loading: false,
  success: false,
  error: null,
  allJobs: [], // multiple
  singleJob: null, // single
};

// Slice
const jobApplicationSlice = createSlice({
  name: "jobApplication",
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
      state.singleJob = action.payload;
    },
    requestMultipleSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.allJobs = action.payload;
    },
    requestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    clearApplication: (state) => {
      state.application = null;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  requestSuccess,
  requestMultipleSuccess,
  requestFail,
  clearApplication,
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;

// Get All Applications of current Jobseeker
export const getAllJobs = () => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Fetching Jobs...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/job/all-jobs`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.close();
    dispatch(requestMultipleSuccess(data.jobs));
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Get Single Application
export const getSingleJob = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    Swal.fire({
      title: "Getting Job Information...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/job/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(requestSuccess(data.job));
    Swal.close();
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
