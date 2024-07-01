import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockOutlined as LockIcon,
} from "@mui/icons-material/";
import Input from "./Input";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, googleSignIn } from "../../actions/auth";
import { useSelector } from "react-redux";
import validate from "./validate";
import {
  Avatar,
  Paper,
  Grid,
  Typography,
  Container,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { AUTH_ERROR, CLEAR_AUTH_ERROR } from "../../constants/actionTypes";

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
  const [firstNameError, setFirstNameError] = useState({
    error: false,
    helperText: "",
  });
  const [lastNameError, setLastNameError] = useState({
    error: false,
    helperText: "",
  });
  const [emailError, setEmailError] = useState({
    error: false,
    helperText: "",
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
    helperText: "",
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    error: false,
    helperText: "",
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const globalError = useSelector((state) => state.error);
  const { isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const opts = {
      name,
      value,
      isSignUp,
      emailError,
      passwordError,
      firstNameError,
      lastNameError,
      confirmPasswordError,
      setEmailError,
      setPasswordError,
      setFirstNameError,
      setLastNameError,
      setConfirmPasswordError,
    };
    validate(opts);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const opts = {
      formData,
      isSignUp,
      emailError,
      passwordError,
      firstNameError,
      lastNameError,
      confirmPasswordError,
      setEmailError,
      setFormData,
      setPasswordError,
      setFirstNameError,
      setLastNameError,
      setConfirmPasswordError,
    };
    const validationError = validate(opts);
    if (!validationError) {
      if (isSignUp) {
        dispatch(signUp(formData, navigate));
      } else {
        dispatch(signIn(formData, navigate));
      }
    }
  };

  window.handleCredentialResponse = (credentialResponse) => {
    dispatch(googleSignIn(credentialResponse, navigate));
    navigate("/");
  };

  useEffect(() => {
    if (user) navigate("/");
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <Container component="main" maxWidth="xs" sx={{ padding: "0px" }}>
      <Paper className="flex flex-col mt-12 p-4 items-center min-w-[316px] " sx={{ boxShadow: "var(--sm-shadow)" }}>
        <Avatar
          className="m-4"
          sx={{
            backgroundColor: "rgb(112, 112, 255)",
          }}
        >
          <LockIcon />
        </Avatar>
        <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"} </Typography>
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <Grid container sx={{ margin: "0px", width: "100%" }}>
            {isSignUp && (
              <>
                {/* First Name */}
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autofocus
                  half
                  error={firstNameError}
                />

                {/* Last Name */}
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  autofocus
                  half
                  error={lastNameError}
                />
              </>
            )}

            {/* Email */}
            <Input name="email" label="Email Address" handleChange={handleChange} error={emailError} />

            {/* Password */}
            <Grid item xs={12} sm={12} sx={{ margin: ".5rem" }}>
              <TextField
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                error={passwordError.error}
                helperText={passwordError.helperText}
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
                  error={confirmPasswordError.error}
                  helperText={confirmPasswordError.helperText}
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
          </Grid>
          {/*AUTH ERROR */}
          {globalError.type === AUTH_ERROR && (
            <Grid item xs={12} sm={12} sx={{ margin: "1rem 0.5rem" }}>
              <span className="text-xs text-red-600 font-semibold p-2 bg-red-100">&#9432; {globalError.message}</span>
            </Grid>
          )}
          {/* SignIn or SignUp */}
          <div
            className="flex flex-col justify-center items-center mt-4
 "
          >
            <Button
              sx={{ marginBottom: "1rem", backgroundColor: "dodgerblue" }}
              type="submit"
              variant="contained"
              className="h-[44px] w-[214px]"
              fullwidth="true"
              color="primary"
            >
              {isLoading ? (
                <CircularProgress style={{ width: "20px", height: "20px" }} />
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </Button>
            <div
              id="g_id_onload"
              data-client_id="593387560130-t7sci6qnu6d2r0gnoqkb4n7vtsiosf4k.apps.googleusercontent.com"
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

          {/* Already have an account? | Don't have an account? */}
          <Grid container justifyContent="center" style={{ marginTop: "1rem" }}>
            <Grid item>
              <Button
                onClick={() => {
                  setIsSignUp((prevIsSignUp) => !prevIsSignUp);
                  dispatch({ type: CLEAR_AUTH_ERROR });
                }}
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
