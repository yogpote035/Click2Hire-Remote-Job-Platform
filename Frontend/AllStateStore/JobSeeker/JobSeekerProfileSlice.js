import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import deleteConfirm from "../../src/General/DeleteConfirm";
const initialState = {
  loading: false,
  success: false,
  error: null,
  jobseeker: null,
};

const employeeProfileSlice = createSlice({
  name: "employeeProfile",
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
      state.jobseeker = action.payload;
    },
    requestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      // toast.error(action.payload);
    },
    clearEmployeeError: (state) => {
      state.success = false;
      state.error = null;
    },
  },
});

export const { requestStart, requestSuccess, requestFail, clearEmployeeError } =
  employeeProfileSlice.actions;

export default employeeProfileSlice.reducer;

// Create Employee Profile
export const createEmployeeProfile =
  (profileData, navigate) => async (dispatch, getState) => {
    dispatch(clearEmployeeError());
    dispatch(requestStart());
    Swal.fire({
      title: "Wait!!, Creating Your Profile...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const token =
        getState().authentication.token || localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/profile/jobseeker`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.close();
      dispatch(requestSuccess(data?.data));
      toast.success("Employee profile created successfully!");
      navigate("/profile");
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// Fetch Employee Profile (by ID or current user)
export const getEmployeeProfile = (id) => async (dispatch, getState) => {
  dispatch(clearEmployeeError());
  dispatch(requestStart());
  Swal.fire({
    title: "Wait!!, Getting Your Profile...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/profile/jobseeker/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    Swal.close();
    dispatch(requestSuccess(data?.data));
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Update Employee Profile
export const updateEmployeeProfile =
  (id, profileData, navigate) => async (dispatch, getState) => {
    dispatch(clearEmployeeError());
    dispatch(requestStart());
    Swal.fire({
      title: "Wait!!, Updating Your Profile...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const token =
        getState().authentication.token || localStorage.getItem("token");
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/profile/jobseeker/${id}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(requestSuccess(data?.data));
      Swal.close();
      toast.success("Employee profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// Delete Employee Profile
export const deleteEmployeeProfile =
  (id, navigate) => async (dispatch, getState) => {
    dispatch(clearEmployeeError());
    const confirm = await deleteConfirm(
      "Delete Your Profile?.",
      "Are You Sure,This Action Cannot Be Undone"
    );
    if (confirm === true) {
      dispatch(requestStart());
      Swal.fire({
        title: "Wait!!, Deleting Your profile...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const token =
          getState().authentication.token || localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_API}/profile/jobseeker/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.close();
        dispatch(clearEmployee());
        toast.success("Employee profile deleted successfully!");
        navigate("/");
      } catch (error) {
        Swal.close();
        dispatch(requestFail(error.response?.data?.message || error.message));
      }
    }
  };
