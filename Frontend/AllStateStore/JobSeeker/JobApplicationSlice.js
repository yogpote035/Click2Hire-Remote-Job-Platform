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
  applications: [], // multiple
  application: null, // single
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
      state.application = action.payload;
    },
    requestDownloadSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
    },
    requestMultipleSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.applications = action.payload;
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
  requestDownloadSuccess,
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;

// Apply for a Job
export const applyForJob =
  (formData, navigate) => async (dispatch, getState) => {
    dispatch(requestStart());
    Swal.fire({
      title: "Submitting Application...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const token =
        getState().authentication.token || localStorage.getItem("token");

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/jobseeker/apply-job/apply`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.close();
      dispatch(requestSuccess(data?.data));
      toast.success("Application submitted successfully!");
      navigate("/my-applications"); // redirect to user's applications
    } catch (error) {
      Swal.close();
      dispatch(requestFail(error.response?.data?.message || error.message));
    }
  };

// Get All Applications of current Jobseeker
export const getMyApplications = () => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Fetching your applications...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/jobseeker/apply-job/my-applications`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.close();
    dispatch(requestMultipleSuccess(data?.data));
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Get Single Application
export const getApplication = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/jobseeker/apply-job/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(requestSuccess(data?.data));
  } catch (error) {
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};

// Withdraw/Delete Application
export const deleteApplication =
  (id, jobId, navigate) => async (dispatch, getState) => {
    const confirm = await deleteConfirm(
      "Withdraw Application?",
      "This action cannot be undone."
    );
    if (confirm === true) {
      dispatch(requestStart());
      Swal.fire({
        title: "Withdrawing application...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      try {
        const token =
          getState().authentication.token || localStorage.getItem("token");

        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_API
          }/jobseeker/apply-job/withdraw/${id}`,
          {
            params: {
              jobId: jobId,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.close();
        toast.success("Application withdrawn successfully!");
        navigate("/my-applications");
        dispatch(clearApplication());
      } catch (error) {
        Swal.close();
        dispatch(requestFail(error.response?.data?.message || error.message));
      }
    }
  };

// Download Application as PDF
export const downloadApplication = (id) => async (dispatch, getState) => {
  dispatch(requestStart());
  Swal.fire({
    title: "Preparing your application PDF...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/jobseeker/apply-job/${id}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // important for file download
      }
    );

    Swal.close();

    // Create a URL for the blob and force download
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `application-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    dispatch(requestDownloadSuccess());
    toast.success("Application downloaded successfully!");
  } catch (error) {
    Swal.close();
    dispatch(requestFail(error.response?.data?.message || error.message));
  }
};
