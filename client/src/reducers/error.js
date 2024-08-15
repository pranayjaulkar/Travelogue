import { CLEAR_AUTH_ERROR, AUTH_ERROR, SOMETHING_WENT_WRONG } from "../constants/actionTypes";

const defaultError = {
  error: null,
  type: SOMETHING_WENT_WRONG,
  message: "",
  statusCode: null,
};
export default function errorReducer(error = defaultError, action) {
  if (action.type === AUTH_ERROR) {
    return { ...action.payload, type: action.type };
  }
  if (action.type === CLEAR_AUTH_ERROR) {
    return { defaultError };
  }
  if (action.type === SOMETHING_WENT_WRONG) {
    return { ...action.payload };
  } else {
    return error;
  }
}
