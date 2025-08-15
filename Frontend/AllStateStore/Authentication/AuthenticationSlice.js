import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  role: null,
  token: null,
};
const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      (state.user = {
        userId: action.payload.id,
        username: action.payload.fullName,
      }),
        (state.token = action.payload.token);
      state.role = action.payload.role; // set role
      localStorage.setItem("token", action.payload.token); // store token in local storage
      localStorage.setItem("role", action.payload.role); // store role in local storage
      localStorage.setItem("userId", action.payload.id); // store user in local storage
      localStorage.setItem("username", action.payload.fullName); // store username in local storage
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.role = null; // reset role
      localStorage.clear();
      state.error = null;
      state.loading = false;
    },
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      (state.user = {
        userId: action.payload.id,
        username: action.payload.fullName,
      }),
        (state.token = action.payload.token);
      state.role = action.payload.role; // set role
      localStorage.setItem("token", action.payload.token); // store token in local storage
      localStorage.setItem("role", action.payload.role); // store role in local storage
      localStorage.setItem("userId", action.payload.id); // store user in local storage
      localStorage.setItem("username", action.payload.fullName); // store username in local storage
      // implement in local storage
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    otpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    otpSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      (state.user = {
        userId: action.payload.id,
        username: action.payload.fullName,
      }),
        (state.token = action.payload.token);
      state.role = action.payload.role;
      localStorage.setItem("token", action.payload.token); // store token in local storage
      localStorage.setItem("role", action.payload.role); // store role in local storage
      localStorage.setItem("userId", action.payload.id); // store user in local storage
      localStorage.setItem("username", action.payload.fullName); // store username in local storage
    },
    otpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  signupRequest,
  signupSuccess,
  signupFailure,
  otpRequest,
  otpSuccess,
  otpFailure,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;

export const loginEmailPassword =
  (email, password, navigate) => async (dispatch, getState) => {
    const { loading } = getState().authentication;
    if (loading) {
      toast.error("Already processing a request. Please wait.");
      return;
    }
    dispatch(loginRequest());

    Swal.fire({
      title: "Logging in...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/auth/login/email-password`,
        { email, password }
      );
      if (response.status === 203) {
        Swal.close();
        toast.error("Email Not Found. Please try again,or Verify Email.");
        dispatch(
          loginFailure(
            response.data.message ||
              "Email Not Found. Please try again,or Verify Email."
          )
        );
        return;
      }
      if (response.status === 204) {
        Swal.close();
        let msg =
          response.data.message ||
          "Password Not Match. Please try Again And Verify Credentials...";
        toast.error(msg);
        dispatch(loginFailure(msg));
        return;
      }
      Swal.close();
      dispatch(loginSuccess(response.data));
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      Swal.close();
      dispatch(loginFailure({ error: error.response.data.message }));
      toast.error(error.response.data.message);
    }
  };

export const loginNumberPassword =
  (number, password, navigate) => async (dispatch, getState) => {
    const { loading } = getState().authentication;
    if (loading) {
      toast.error("Already processing a request. Please wait.");
      return;
    }
    dispatch(loginRequest());
    Swal.fire({
      title: "Logging in...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/auth/login/mobile-password`,
        { number, password }
      );
      if (response.status === 203) {
        Swal.close();
        toast.error(
          "Mobile Number Not Found. Please try again,or Verify Mobile Number."
        );
        dispatch(
          loginFailure(
            response.data.message ||
              "Mobile Number Not Found. Please try again,or Verify Mobile Number."
          )
        );
        return;
      }
      if (response.status === 204) {
        Swal.close();
        let msg =
          response.data.message ||
          "Password Not Match. Please try Again And Verify Credentials...";
        toast.error(msg);
        dispatch(loginFailure(msg));
        return;
      }
      Swal.close();
      dispatch(loginSuccess(response.data));
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      Swal.close();
      dispatch(loginFailure({ error: error.response.data.message }));
      toast.error(error.response.data.message);
    }
  };

export const otpSent = (email) => async (dispatch, getState) => {
  const { loading } = getState().authentication;
  if (loading) {
    toast.error("Already processing a request. Please wait.");
    return;
  }
  dispatch(otpRequest());
  Swal.fire({
    title: "Sending OTP...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/auth/login/send-otp`,
      { email }
    );
    if (response.status === 203) {
      Swal.close();
      toast.error("Email Not Found. Please try again,or Verify Email.");
      dispatch(
        otpFailure(
          response.data.message ||
            "Email Not Found. Please try again,or Verify Email."
        )
      );
      return;
    }
    Swal.close();
    dispatch(otpSuccess(response.data));
    toast.success("OTP sent successfully!");
    Swal.fire({
      // position: "top-end",
      icon: "success",
      title: "OTP sent successfully!",
      text: "Please check your email for the OTP.",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    Swal.close();
    dispatch(otpFailure({ error: error.response.data.message }));
    toast.error(error.response.data.message);
  }
};

export const verifyOtp =
  (email, otp, navigate) => async (dispatch, getState) => {
    const { loading } = getState().authentication;
    if (loading) {
      toast.error("Already processing a request. Please wait.");
      return;
    }
    dispatch(otpRequest());
    Swal.fire({
      title: "Verifying OTP...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/auth/login/verify-otp`,
        { email, otp }
      );
      if (response.status === 203) {
        Swal.close();
        toast.error("Email Not Found. Please try again,or Verify Email.");
        dispatch(
          otpFailure(
            response.data.message ||
              "Email Not Found. Please try again,or Verify Email."
          )
        );
        return;
      }
      if (response.status === 204) {
        Swal.close();
        const msg = response.data.message || "Invalid OTP. Please try again.";
        toast.error(msg);
        dispatch(otpFailure(msg));
        return;
      }
      dispatch(otpSuccess(response.data));
      Swal.close();
      toast.success("OTP verified successfully!");
      Swal.fire({
        icon: "success",
        title: "OTP verified successfully!",
        text: "You are now logged in.",
        showConfirmButton: false,
        timer: 1500,
      });
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      Swal.close();
      dispatch(otpFailure({ error: error.response.data.message }));
      toast.error(error.response.data.message);
    }
  };

export const signupJobseeker =
  (formData, navigate) => async (dispatch, getState) => {
    const { loading } = getState().authentication;
    if (loading) {
      toast.error("Already processing a request. Please wait.");
      return;
    }
    dispatch(signupRequest());
    Swal.fire({
      title: "Signing up...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/auth/signup/jobseeker`,
        formData
      );
      if (response.status === 203) {
        Swal.close();
        toast.error("Email already exists. Please try another email.");
        dispatch(
          signupFailure(response.data.message || "Email already exists.")
        );
        return;
      }
      if (response.status === 204) {
        Swal.close();
        let msg =
          response.data.message ||
          "Mobile number already exists. Please try another mobile number.";
        toast.error(msg);
        dispatch(signupFailure(msg));
        return;
      }
      Swal.close();
      dispatch(signupSuccess(response.data));
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      Swal.close();
      dispatch(signupFailure({ error: error.response.data.message }));
      toast.error(error.response.data.message);
    }
  };
export const signupEmployer =
  (formData, navigate) => async (dispatch, getState) => {
    const { loading } = getState().authentication;
    if (loading) {
      toast.error("Already processing a request. Please wait.");
      return;
    }
    dispatch(signupRequest());
    Swal.fire({
      title: "Signing up...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/auth/signup/employer`,
        formData
      );
      if (response.status === 203) {
        Swal.close();
        toast.error("Email already exists. Please try another email.");
        dispatch(
          signupFailure(response.data.message || "Email already exists.")
        );
        return;
      }
      if (response.status === 204) {
        Swal.close();
        let msg =
          response.data.message ||
          "Mobile number already exists. Please try another mobile number.";
        toast.error(msg);
        dispatch(signupFailure(msg));
        return;
      }
      if (response.status === 200) {
        Swal.close();
        dispatch(signupSuccess(response.data));
        toast.success("Signup successful!");
        navigate("/");
      }
    } catch (error) {
      Swal.close();
      dispatch(signupFailure({ error: error.response.data.message }));
      toast.error(error.response.data.message);
    }
  };

export const logoutUser = () => (dispatch, getState) => {
  const { loading } = getState().authentication;
  if (loading) {
    toast.error("Already processing a request. Please wait.");
    return;
  }
  dispatch(logout());
  toast.success("Logged out successfully!");
};

// Selector to access authentication state,to be used in components ,for prevent multiple imports
export const selectAuthentication = (state) => state.authentication;
