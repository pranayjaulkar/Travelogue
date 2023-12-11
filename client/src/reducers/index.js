import { combineReducers } from "redux";
import posts from "./posts";
import user from "./auth";
import error from "./error";

export default combineReducers({
  posts,
  user,
  error,
});
