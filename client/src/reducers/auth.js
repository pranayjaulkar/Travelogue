import { LOGOUT, SIGN_IN, SIGN_UP } from "../constants/actionTypes";

export default function authReducer(user = null, action) {
  if (action.type === SIGN_UP) {
    return action.payload;
  }
  if (action.type === SIGN_IN) {
    return action.payload;
  }
  if (action.type === LOGOUT) {
    return null;
  } else {
    return user;
  }
}
