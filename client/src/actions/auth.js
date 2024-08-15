import * as api from "../api";
import {
  LOGOUT,
  SIGN_IN,
  SIGN_UP,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  START_LOADING,
  STOP_LOADING,
} from "../constants/actionTypes";
import toast from "react-hot-toast";
import errorHandler from "../utils/errorHandler";

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
    import.meta.env.DEV && console.log("error: ", error);
    errorHandler({ dispatch, type: error.response && AUTH_ERROR, error });
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
    import.meta.env.DEV && console.log("error: ", error);
    dispatch({ type: STOP_LOADING });
    errorHandler({ dispatch, error });
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
    import.meta.env.DEV && console.log("error: ", error);
    dispatch({ type: STOP_LOADING });
    errorHandler({ dispatch, type: error.response && AUTH_ERROR, error });
  }
};
export const logout = () => async (dispatch) => {
  try {
    const res = await api.logout();

    if (res.status === 200) {
      dispatch({ type: LOGOUT });
    }
  } catch (error) {
    import.meta.env.DEV && console.log("error: ", error);
    errorHandler({ dispatch, error });
  }
};
export const refreshAccessToken = (navigate) => async (dispatch) => {
  try {
    const res = await api.refreshAccessToken();

    if (res.data) {
      dispatch({ type: SIGN_IN, payload: res.data });
    }
  } catch (error) {
    import.meta.env.DEV && console.log("error: ", error);
    errorHandler({ dispatch, type: error.response && AUTH_ERROR, error, navigate });
  }
};
