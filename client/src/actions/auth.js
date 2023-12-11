import * as api from "../api";
import {
  LOGOUT,
  SIGN_IN,
  SIGN_UP,
  AUTH_ERROR,
  SOMETHING_WENT_WRONG,
  START_LOADING,
  STOP_LOADING,
} from "../constants/actionTypes";

export const signIn = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { confirmPassword, firstName, lastName, ...newFormData } = formData;
    const res = await api.SignIn(newFormData);
    const user = res.data;
    dispatch({ type: STOP_LOADING });
    if (user) {
      dispatch({ type: SIGN_IN, payload: user });
      navigate("/");
    }
  } catch (error) {
    dispatch({ type: STOP_LOADING });
    const res = error.response;
    if (res && res.status === 404 && res.data.error === "USER_NOT_FOUND") {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          type: AUTH_ERROR,
          statusCode: 404,
          error,
          message: "No user account found with this email.",
        },
      });
    } else if (
      res &&
      res.status === 403 &&
      res.data.error === "INVALID_EMAIL_OR_PASSWORD"
    ) {
      console.log(error);
      dispatch({
        type: AUTH_ERROR,
        payload: {
          type: AUTH_ERROR,
          statusCode: 403,
          error,
          message: "Invalid email or password. please try again",
        },
      });
    } else if (
      res &&
      res.status === 400 &&
      res.data.error === "USER_IS_GOOGLE_USER"
    ) {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          type: AUTH_ERROR,
          statusCode: 400,
          error,
          message:
            "You previously used google to Sign In. Please Sign In with your Google account",
        },
      });
    } else {
      dispatch({
        type: SOMETHING_WENT_WRONG,

        payload: {
          type: SOMETHING_WENT_WRONG,
          statusCode: null,
          error,
          message: error.message,
        },
      });
      navigate("/error");
    }
  }
};
export const googleSignIn = (data, navigate) => async (dispatch) => {
  try {
    const res = await api.SignIn(data);
    const user = res.data;
    if (user) {
      dispatch({ type: SIGN_IN, payload: user });
    }
  } catch (error) {
    dispatch({ type: STOP_LOADING });
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: {
        type: SOMETHING_WENT_WRONG,
        statusCode: null,
        error,
        message: error.message,
      },
    });
    navigate("/error");
  }
};
export const signUp = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { confirmPassword, ...newFormData } = formData;
    const res = await api.SignUp(newFormData);
    const user = res.data;
    dispatch({ type: SIGN_UP, payload: user });
    dispatch({ type: STOP_LOADING });
    navigate("/");
  } catch (error) {
    const res = error.response;
    dispatch({ type: STOP_LOADING });
    if (res && res.status === 400 && res.data.error === "USER_ALREADY_EXISTS") {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          type: AUTH_ERROR,
          statusCode: 400,
          error,
          message: "User already exists with this email.",
        },
      });
    } else {
      dispatch({
        type: SOMETHING_WENT_WRONG,
        payload: {
          type: SOMETHING_WENT_WRONG,
          statusCode: null,
          error,
          message: error.message,
        },
      });
      navigate("/error");
    }
  }
};
export const logout = (navigate) => async (dispatch) => {
  try {
    const res = await api.logout();
    if (res.status === 200) {
      dispatch({ type: LOGOUT });
    }
  } catch (error) {
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: {
        type: SOMETHING_WENT_WRONG,
        statusCode: null,
        error,
        message: error.message,
      },
    });
    navigate("/error");
  }
};
export const refreshAccessToken = (navigate) => async (dispatch) => {
  try {
    const res = await api.refreshAccessToken();
    let user;
    if (res.data) {
      user = res.data;
      dispatch({ type: SIGN_IN, payload: user });
    }
  } catch (error) {
    const res = error.response;
    if (res && res.status === 404 && res.data.error === "TOKEN_NOT_FOUND") {
      //do nothing
    } else if (
      res &&
      res.status === 403 &&
      (res.data.error === "ACCESS_TOKEN_NOT_FOUND" ||
        res.data.error === "TOKEN_EXPIRED")
    ) {
      navigate("/auth");
    } else {
      dispatch({
        type: SOMETHING_WENT_WRONG,
        payload: { error, message: error.message },
      });
      // navigate("/error");
    }
  }
};
