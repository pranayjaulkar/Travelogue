import * as api from "../api";
import {
  LOGOUT,
  SIGN_IN,
  SIGN_UP,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  SOMETHING_WENT_WRONG,
  START_LOADING,
  STOP_LOADING,
} from "../constants/actionTypes";
import toast from "react-hot-toast";

export const signIn = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { password, email } = formData;
    const res = await api.SignIn({ email, password });
    const user = res.data;
    dispatch({ type: STOP_LOADING });
    if (user) {
      dispatch({ type: SIGN_IN, payload: user });
      navigate("/");
      toast.success("Successfully Logged In");
    }
    dispatch({ type: CLEAR_AUTH_ERROR });
  } catch (error) {
    dispatch({ type: STOP_LOADING });
    if (error.response) {
      switch (error.response.data.error) {
        case "USER_NOT_FOUND":
          dispatch({
            type: AUTH_ERROR,
            payload: {
              type: AUTH_ERROR,
              statusCode: 404,
              error,
              message: "No user account found with this email.",
            },
          });
          break;
        case "INCORRECT_EMAIL_OR_PASSWORD":
          dispatch({
            type: AUTH_ERROR,
            payload: {
              type: AUTH_ERROR,
              statusCode: 403,
              error,
              message: "Invalid email or password. please try again",
            },
          });
          break;
        case "USER_IS_GOOGLE_USER":
          dispatch({
            type: AUTH_ERROR,
            payload: {
              type: AUTH_ERROR,
              statusCode: 400,
              error,
              message: "You previously used google to Sign In. Please Sign In with your Google account",
            },
          });
          break;

        default:
          dispatch({
            type: SOMETHING_WENT_WRONG,
            payload: {
              type: SOMETHING_WENT_WRONG,
              statusCode: null,
              error,
              message: error.message,
            },
          });
          break;
      }
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
    }
  }
};
export const googleSignIn = (data) => async (dispatch) => {
  try {
    const res = await api.SignIn(data);
    const user = res.data;
    if (user) {
      dispatch({ type: SIGN_IN, payload: user });
    }
  } catch (error) {
   import.meta.env.DEV &&  console.log('error: ', error);
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
  }
};
export const signUp = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { password, email, lastName, firstName } = formData;
    const res = await api.SignUp({ password, email, lastName, firstName });
    const user = res.data;
    dispatch({ type: SIGN_UP, payload: user });
    dispatch({ type: STOP_LOADING });
    dispatch({ type: CLEAR_AUTH_ERROR });

    navigate("/");
  } catch (error) {
    import.meta.env.DEV &&  console.log('error: ', error);
    dispatch({ type: STOP_LOADING });
    if (error?.response?.data?.error === "USER_ALREADY_EXISTS") {
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
    }
  }
};
export const logout = () => async (dispatch) => {
  try {
    const res = await api.logout();
    if (res.status === 200) {
      dispatch({ type: LOGOUT });
    }
  } catch (error) {
   import.meta.env.DEV &&  console.log('error: ', error);
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: {
        type: SOMETHING_WENT_WRONG,
        statusCode: null,
        error,
        message: error.message,
      },
    });
  }
};
export const refreshAccessToken = (navigate) => async (dispatch) => {
  try {
    const res = await api.refreshAccessToken();
    if (res.data) {
      dispatch({ type: SIGN_IN, payload: res.data });
    }
  } catch (error) {
   import.meta.env.DEV &&  console.log('error: ', error);
    if (error?.response?.data?.error === "TOKEN_NOT_FOUND") {
      //do nothing
    } else if (
      error?.response?.data?.error === "ACCESS_TOKEN_NOT_FOUND" ||
      error?.response?.data?.error === "TOKEN_EXPIRED"
    ) {
      navigate("/auth");
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
    }
  }
};
