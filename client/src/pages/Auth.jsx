import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, googleSignIn } from "../actions/auth";
import { useSelector } from "react-redux";
import { userValidate } from "../utils/validate";
import { AUTH_ERROR, CLEAR_AUTH_ERROR, SOMETHING_WENT_WRONG } from "../constants/actionTypes";

import SpinningLoader from "../components/SpinningLoader";
import { Avatar, Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockIcon,
} from "@mui/icons-material/";
import Input from "../components/Input";

export default function Auth() {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const user = useSelector((state) => state.user);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState({
    firstName: { error: false, helperText: "" },
    lastName: { error: false, helperText: "" },
    email: { error: false, helperText: "" },
    password: { error: false, helperText: "" },
    confirmPassword: { error: false, helperText: "" },
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const globalError = useSelector((state) => state.error);
  const { isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    try {
      if (validationError[event.target.name].error) {
        setValidationError((prev) => ({ ...prev, [event.target.name]: { error: false, helperText: "" } }));
      }
      setFormData({ ...formData, [event.target.name]: event.target.value });
    } catch (error) {
      dispatch({ type: SOMETHING_WENT_WRONG, payload: { type: SOMETHING_WENT_WRONG, message: error.message } });
      import.meta.env.DEV && console.log("error: ", error);
    }
  };

  const handleSubmit = (event) => {
    try {
      event.preventDefault();
      dispatch({ type: CLEAR_AUTH_ERROR });
      if (isSignUp) {
        const validateErr = userValidate({ formData, isSignUp, setValidationError });
        !validateErr && dispatch(signUp(formData, navigate));
      } else if (!isSignUp) {
        dispatch(signIn(formData, navigate));
      }
    } catch (error) {
      dispatch({ type: SOMETHING_WENT_WRONG, payload: { type: SOMETHING_WENT_WRONG, message: error.message } });
      import.meta.env.DEV && console.log("error: ", error);
    }
  };

  window.handleCredentialResponse = (credentialResponse) => {
    dispatch(googleSignIn(credentialResponse, navigate));
    navigate("/");
  };

  useEffect(() => {
    if (user) navigate("/");
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    dispatch({ type: CLEAR_AUTH_ERROR });
  }, []);

  return (
    <div className="tw-mt-12 tw-text-sm tw-w-full md:tw-w-[500px] tw-max-w-screen-sm tw-px-4 tw-mx-auto">
      <div className="flex flex-col mt-12 p-4 items-center min-w-[316px] tw-border tw-rounded-md tw-p-4">
        <Avatar
          sx={{
            margin: "0 auto 1rem auto",
            backgroundColor: "rgb(112, 112, 255)",
          }}
        >
          <LockIcon />
        </Avatar>
        <h1 className="tw-text-2xl tw-font-semibold tw-text-center">{isSignUp ? "Sign Up" : "Sign In"} </h1>
        {/*AUTH ERROR */}
        {globalError.type === AUTH_ERROR && (
          <div className="tw-px-2 tw-py-2">
            <span className="tw-text-sm tw-text-red-600 tw-font-semibold "> {globalError.message}</span>
          </div>
        )}
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <div className="">
            {isSignUp && (
              <>
                {/* First Name */}
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autofocus
                  half
                  error={validationError.firstName}
                />

                {/* Last Name */}
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  autofocus
                  half
                  error={validationError.lastName}
                />
              </>
            )}

            {/* Email */}
            <Input name="email" label="Email Address" handleChange={handleChange} error={validationError.email} />

            {/* Password */}
            <Grid item xs={12} sm={12} sx={{ margin: ".5rem" }}>
              <TextField
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                error={validationError.password.error}
                helperText={validationError.password.helperText}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Confirm Password */}
            {isSignUp && (
              <Grid item xs={12} sm={12} sx={{ margin: ".5rem" }}>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  error={validationError.confirmPassword.error}
                  helperText={validationError.confirmPassword.helperText}
                  onChange={handleChange}
                  type={showConfirmPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword)}
                        >
                          {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-items-center tw-py-4 tw-px-2  tw-w-full">
            <div className="tw-flex tw-w-full tw-space-x-4 tw-mb-4 tw-justify-between tw-items-center">
              {/* Already have an account? | Don't have an account? */}
              <div>
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <span
                  onClick={() => {
                    setIsSignUp((prev) => !prev);
                    dispatch({ type: CLEAR_AUTH_ERROR });
                  }}
                  className="tw-text-blue-500 tw-cursor-pointer hover:tw-underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </span>
              </div>

              {/* SignIn or SignUp */}
              <button
                type="submit"
                className="tw-bg-blue-500 tw-min-w-[98px] tw-px-6 tw-py-2 tw-rounded-full  tw-text-white tw-flex tw-justify-center tw-items-center"
              >
                {isLoading ? <SpinningLoader color="#fff" size={20} /> : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </div>

            {/* Google SignIn */}
            <div
              id="g_id_onload"
              data-client_id="395862073298-bdfhqp0tdkm4qn749umnrl4oj79odihc.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-callback="handleCredentialResponse"
              data-auto_prompt="false"
            ></div>

            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
            ></div>
          </div>
        </form>
      </div>
    </div>
  );
}
