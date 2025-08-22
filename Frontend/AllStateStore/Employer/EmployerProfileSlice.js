import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import deleteConfirm from "../../src/General/DeleteConfirm";
import Swal from "sweetalert2";

const initialState = {
  loading: false,
  success: false,
  error: null,
  employer: null,
};

// Slice
const employerProfileSlice = createSlice({
  name: "employerProfile",
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
      state.employer = action.payload;
    },
    requestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearEmployer: (state) => {
      state.employer = null;
      state.success = false;
      state.error = null;
    },
  },
});

export const { requestStart, requestSuccess, requestFail, clearEmployer } =
  employerProfileSlice.actions;

export default employerProfileSlice.reducer;

export const createEmployerProfile =
  (profileData, navigate) => async (dispatch, getState) => {
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
        `${import.meta.env.VITE_BACKEND_API}/profile/employer/`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(requestSuccess(data?.data));
      toast.success("Employer profile created successfully!");
      navigate("/profile");
      Swal.close();
    } catch (error) {
      Swal.close();
      toast.error(action.payload);
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// Fetch Employer Profile (by ID or current user)
export const getEmployerProfile = (id) => async (dispatch, getState) => {
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
      `${import.meta.env.VITE_BACKEND_API}/profile/employer/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    Swal.close();
    dispatch(requestSuccess(data?.data));
  } catch (error) {
    Swal.close();
    toast.error(action.payload);
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Update Employer Profile
export const updateEmployerProfile =
  (id, profileData, navigate) => async (dispatch, getState) => {
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
        `${import.meta.env.VITE_BACKEND_API}/profile/employer/${id}`,
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
      toast.success("Employer profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      Swal.close();
      toast.error(action.payload);
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

export const deleteEmployerProfile =
  (id, navigate) => async (dispatch, getState) => {
    const confirm = await deleteConfirm(
      "Delete Your Profile?",
      "Are You Sure , This Action Cannot Be Undone"
    );
    if (confirm === true) {
      dispatch(requestStart());
      Swal.fire({
        title: "Wait!!, Deleting Your Profile...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const token =
          getState().authentication.token || localStorage.getItem("token");

        await axios.delete(
          `${import.meta.env.VITE_BACKEND_API}/profile/employer/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.close();
        dispatch(clearEmployer());
        toast.success("Employer profile deleted successfully!");
        navigate("/");
      } catch (error) {
        Swal.close();
        toast.error(action.payload);
        dispatch(requestFail(error.response?.data?.message || error.message));
      }
    }
  };
