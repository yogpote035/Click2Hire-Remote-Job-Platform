import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import deleteConfirm from "../../src/General/DeleteConfirm";

const initialState = {
  loading: false,
  success: false,
  error: null,
  allCandidate: [], // all company
  candidate: null, // single company
};

const candidateShowSlice = createSlice({
  name: "candidateShow",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    allCandidateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.allCandidate = action.payload;
    },
    singleCandidate: (state, action) => {
      state.loading = false;
      state.success = true;
      state.candidate = action.payload; // single or multiple
    },
    requestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    clearCandidate: (state) => {
      state.job = null;
      state.jobs = [];
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  allCandidateSuccess,
  singleCandidate,
  requestFail,
  clearCandidate,
} = candidateShowSlice.actions;

export default candidateShowSlice.reducer;

// get all employer as company ....
export const getAllCandidate = () => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    Swal.fire({
      title: "Wait!!,We Are Searching For Companies...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/candidate`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(allCandidateSuccess(data?.data));
    Swal.close();
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
// get single employer as company ....
export const getCandidateById = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    Swal.fire({
      title: "Wait!!, We are Getting Information About Candidate...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/employer/job-post/candidate/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("data : ", data);
    dispatch(singleCandidate(data?.data));
    Swal.close();
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
