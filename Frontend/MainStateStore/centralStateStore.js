import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../AllStateStore/Authentication/AuthenticationSlice.js";
import EmployeeProfileReducer from "../AllStateStore/JobSeeker/JobSeekerProfileSlice.js";
import EmployerProfileReducer from "../AllStateStore/Employer/EmployerProfileSlice.js";
const Store = configureStore({
  reducer: {
    authentication: authenticationReducer, // Authentication state,all login and signup related data request come and go from here
    jobseekerProfile: EmployeeProfileReducer, //employee profile
    employerProfile: EmployerProfileReducer, //Employer Profile
  },
});
export default Store;
