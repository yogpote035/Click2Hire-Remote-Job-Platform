import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../AllStateStore/Authentication/AuthenticationSlice.js";
const Store = configureStore({
  reducer: {
    authentication: authenticationReducer, // Authentication state,all login and signup related data request come and go from here
  },
});
export default Store;
