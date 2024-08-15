import { CLEAR_AUTH_ERROR, AUTH_ERROR, SOMETHING_WENT_WRONG } from "../constants/actionTypes";

const defaultError = {
  error: null,
  type: "",
  message: "",
  statusCode: null,
};
export default function errorReducer(error = defaultError, action) {
  if (action.type === AUTH_ERROR) {
    console.log("SOMETHING_WENT_WRONG: ", SOMETHING_WENT_WRONG);
    return { ...action.payload };
  }
  if (action.type === CLEAR_AUTH_ERROR) {
    console.log("SOMETHING_WENT_WRONG: ", SOMETHING_WENT_WRONG);
    return { defaultError };
  }
  if (action.type === SOMETHING_WENT_WRONG) {
    console.log("SOMETHING_WENT_WRONG: ", SOMETHING_WENT_WRONG);
    return { ...action.payload };
  } else {
    return error;
  }
}
