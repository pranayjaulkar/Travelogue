import {
  CLEAR_AUTH_ERROR,
  AUTH_ERROR,
  SOMETHING_WENT_WRONG,
} from "../constants/actionTypes";

const errorObj = {
  error: null,
  type: "",
  message: "",
  statusCode: null,
};
export default function errorReducer(error = errorObj, action) {
  if (action.type === AUTH_ERROR) {
    return { ...error, ...action.payload };
  }
  if (action.type === CLEAR_AUTH_ERROR) {
    return { errorObj };
  }
  if (action.type === SOMETHING_WENT_WRONG) {
    return { ...error, SOMETHING_WENT_WRONG: action.payload };
  } else {
    return error;
  }
}
