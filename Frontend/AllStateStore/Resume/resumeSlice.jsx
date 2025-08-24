import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const initialState = {
  loading: false,
  success: false,
  error: null,
  resumeFeedback: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    requestResumeFeedbackSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.resumeFeedback = action.payload;
    },
    requestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    clearResumeFeedback: (state) => {
      state.resumeFeedback = null;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  requestResumeFeedbackSuccess,
  requestFail,
  clearResumeFeedback,
} = resumeSlice.actions;

export default resumeSlice.reducer;

// Scan Resume (independent)
export const scanResume = (file) => async (dispatch, getState) => {
  dispatch(requestStart());

  try {
    Swal.fire({
      title: "Wait!! We are Getting Your Resume Feedback...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const token =
      getState().authentication.token || localStorage.getItem("token");

    if (!file) {
      Swal.close();
      return toast.error("Please Upload A File (PDF/DOC/DOCX)");
    }

    const formData = new FormData();
    formData.append("resume", file);

    const { data } = await toast.promise(
      axios.post(`${import.meta.env.VITE_BACKEND_API}/resume-scan`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      {
        loading: "Wait!! Your feedback is on the way...",
        success: <b>Feedback received!</b>,
        error: <b>Could not get feedback.</b>,
      }
    );

    dispatch(requestResumeFeedbackSuccess(data));
    Swal.close();
    toast.remove();
  } catch (error) {
    Swal.close();
    dispatch(
      requestFail(error.response?.data?.message?.error || error.response?.data)
    );
  }
};
