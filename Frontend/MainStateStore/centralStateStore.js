import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../AllStateStore/Authentication/AuthenticationSlice.js";
import EmployeeProfileReducer from "../AllStateStore/JobSeeker/JobSeekerProfileSlice.js";
import EmployerProfileReducer from "../AllStateStore/Employer/EmployerProfileSlice.js";
import EmployerJobPostReducer from "../AllStateStore/Employer/JobPostSlice.js";
import JobseekerApplyJobReducer from "../AllStateStore/JobSeeker/JobApplicationSlice.js";
import jobReducer from "../AllStateStore/Job/JobSlice.js";
import resumeReducer from "../AllStateStore/Resume/resumeSlice.jsx";
import companyReducer from "../AllStateStore/CompanyInfo/CompanySlice.js";
import candidateReducer from "../AllStateStore/CandidateShow/CandidateShowSlice.js";
const Store = configureStore({
  reducer: {
    authentication: authenticationReducer, // Authentication state,all login and signup related data request come and go from here[CRUD]
    jobseekerProfile: EmployeeProfileReducer, //employee profile CRUD
    employerProfile: EmployerProfileReducer, //Employer Profile CRUD
    employerJobPost: EmployerJobPostReducer, //Employer Job CRUD
    jobseekerApplyJob: JobseekerApplyJobReducer, //Employer Job CRUD
    job: jobReducer, //get all job matched to skill / search job(any) / single job
    resume: resumeReducer, // scan resume and get feedback
    company: companyReducer, // all company Operations
    candidate: candidateReducer, // all candidate for job and single candidate
  },
});
export default Store;
