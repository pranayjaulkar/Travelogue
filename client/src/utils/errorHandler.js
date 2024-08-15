import { AUTH_ERROR, SOMETHING_WENT_WRONG } from "../constants/actionTypes";
export default function errorHandler({ dispatch, type = SOMETHING_WENT_WRONG, error, navigate }) {
  if (
    error instanceof TypeError ||
    error instanceof ReferenceError ||
    error instanceof EvalError ||
    error instanceof RangeError ||
    error instanceof SyntaxError ||
    error instanceof URIError
  ) {
    dispatch({
      type: type,
      payload: {
        error,
        message: "An unexpected error has ocurred.",
      },
    });
  } else
    switch (type) {
      case AUTH_ERROR:
        switch (error?.response?.data?.error) {
          case "USER_NOT_FOUND":
            dispatch({
              type: AUTH_ERROR,
              payload: {
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
                statusCode: 400,
                error,
                message: "You previously used google to Sign In. Please Sign In with your Google account",
              },
            });
            break;
          case "USER_ALREADY_EXISTS":
            dispatch({
              type: AUTH_ERROR,
              payload: {
                statusCode: 400,
                error,
                message: "User already exists with this email.",
              },
            });
            break;
          case "ACCESS_TOKEN_NOT_FOUND":
            navigate && navigate("/auth");
            break;
          case "TOKEN_NOT_FOUND":
            break;

          default:
            break;
        }
        break;

      default:
        dispatch({
          type: type,
          payload: {
            error,
            message: error.message,
          },
        });
        break;
    }
}
