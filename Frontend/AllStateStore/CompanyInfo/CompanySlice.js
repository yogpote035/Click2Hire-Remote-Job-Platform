import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import deleteConfirm from "../../src/General/DeleteConfirm";

const initialState = {
  loading: false,
  success: false,
  error: null,
  allCompany: [], // all company
  company: null, // single company
};

const companySlice = createSlice({
  name: "employerJobs",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    allCompanySuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.allCompany = action.payload;
    },
    singleCompanySuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.company = action.payload; // single or multiple
    },
    requestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    clearCompany: (state) => {
      state.job = null;
      state.jobs = [];
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  allCompanySuccess,
  singleCompanySuccess,
  requestFail,
  clearCompany,
} = companySlice.actions;

export default companySlice.reducer;

// get all employer as company ....
export const getAllCompanies = () => async (dispatch, getState) => {
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
      `${
        import.meta.env.VITE_BACKEND_API
      }/employer/job-post/all-employer`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(allCompanySuccess(data?.data));
    Swal.close();
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
// get single employer as company ....
export const getCompanyById = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    Swal.fire({
      title: "Wait!!, We are Getting Information About Company...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_API
      }/employer/job-post/employer/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(singleCompanySuccess(data?.data));
    Swal.close();
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
