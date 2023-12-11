import { userSchema } from "../../schema/schema";

//Joi Validation function to validate data
export default function validate({
  name,
  value,
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
}) {
  //validation after submit
  if (formData) {
    // Email validation
    const validatedEmail = userSchema.extract("email").validate(formData.email);
    if (
      validatedEmail.error &&
      validatedEmail.error.details[0].type === "string.email"
    ) {
      setEmailError({ helperText: "Invalid Email", error: true });
    } else if (
      validatedEmail.error &&
      validatedEmail.error.details[0].type === "string.empty"
    ) {
      setEmailError({ helperText: "Email cannot be empty", error: true });
    } else {
      setFormData({
        ...formData,
        email: validatedEmail.value,
      });
      setEmailError({ ...emailError, error: false });
    }

    // password validation
    const validatedPassword = userSchema
      .extract("password")
      .validate(formData.password);
    if (
      validatedPassword.error &&
      validatedPassword.error.details[0].type === "string.empty"
    ) {
      setPasswordError({
        helperText: "Password cannot be empty",
        error: true,
      });
    } else if (
      validatedPassword.error &&
      validatedPassword.error.details[0].type === "string.pattern.base"
    ) {
      setPasswordError({
        helperText: "Password must contain 8 characters (A-Z,a-z,0-9)",
        error: true,
      });
    } else {
      setFormData({
        ...formData,
        password: validatedPassword.value,
      });
      setPasswordError({ ...passwordError, error: false });
    }

    let validatedFirstName = {};
    let validatedLastName = {};
    let validatedConfirmPassword = {};
    if (isSignUp) {
      //firstName Validation
      const validatedFirstName = userSchema
        .extract("firstName")
        .validate(formData.firstName);
      if (
        validatedFirstName.error &&
        validatedFirstName.error.details[0].type === "string.empty"
      ) {
        setFirstNameError({
          helperText: "First Name cannot be empty",
          error: true,
        });
      } else if (
        validatedFirstName.error &&
        validatedFirstName.error.details[0].type === "string.pattern.base"
      ) {
        setFirstNameError({
          helperText:
            "First Name must contain only Alphanumeric characters (A-Z,a-z,0-9)",
          error: true,
        });
      } else {
        setFormData({
          ...formData,
          firstName: validatedFirstName.value,
        });
        setFirstNameError({ ...firstNameError, error: false });
      }

      //lastName Validation
      const validatedLastName = userSchema
        .extract("lastName")
        .validate(formData.lastName);
      if (
        validatedLastName.error &&
        validatedLastName.error.details[0].type === "string.empty"
      ) {
        setLastNameError({
          helperText: "Last Name cannot be empty",
          error: true,
        });
      } else if (
        validatedLastName.error &&
        validatedLastName.error.details[0].type === "string.pattern.base"
      ) {
        setLastNameError({
          helperText:
            "Last Name must contain only Alphanumeric characters (A-Z,a-z,0-9)",
          error: true,
        });
      } else {
        setFormData({
          ...formData,
          lastName: validatedLastName.value,
        });
        setLastNameError({ ...lastNameError, error: false });
      }

      // Confirm password validation
      const validatedConfirmPassword = userSchema
        .extract("confirmPassword")
        .validate(formData.confirmPassword);
      if (validatedConfirmPassword.value !== validatedPassword.value) {
        setConfirmPasswordError({
          helperText: "Confirm Password doesn't match Password",
          error: true,
        });
      } else if (
        validatedConfirmPassword.error &&
        validatedConfirmPassword.error.details[0].type === "string.empty"
      ) {
        setConfirmPasswordError({
          helperText: "Confirm Password cannot be empty",
          error: true,
        });
      } else {
        setFormData({
          ...formData,
          confirmPassword: validatedConfirmPassword.value,
        });
        setConfirmPasswordError({ ...confirmPasswordError, error: false });
      }
    }

    if (
      validatedFirstName.error ||
      validatedLastName.error ||
      validatedEmail.error ||
      validatedPassword.error ||
      validatedConfirmPassword.error
    ) {
      return true;
    }
    return false;
  }
  //validation while typing
  else {
    if (name === "email") {
      const validatedEmail = userSchema.extract("email").validate(value);
      if (
        validatedEmail.error &&
        validatedEmail.error.details[0].type === "string.email"
      ) {
        setEmailError({ helperText: "Email is not valid", error: true });
      } else if (
        validatedEmail.error &&
        validatedEmail.error.details[0].type === "string.empty"
      ) {
        setEmailError({ helperText: "Email cannot be empty", error: true });
      } else {
        setEmailError({ helperText: "", error: false });
      }
    }
    if (name === "password") {
      // password validation
      const validatedPassword = userSchema.extract("password").validate(value);
      if (
        validatedPassword.error &&
        validatedPassword.error.details[0].type === "string.empty"
      ) {
        setPasswordError({
          helperText: "Password cannot be empty",
          error: true,
        });
      } else if (
        validatedPassword.error &&
        validatedPassword.error.details[0].type === "string.pattern.base"
      ) {
        setPasswordError({
          helperText: "Password must contain 8 characters (A-Z,a-z,0-9)",
          error: true,
        });
      } else {
        setPasswordError({ helperText: "", error: false });
      }
    }
    if (name === "firstName") {
      //firstName Validation
      const validatedFirstName = userSchema
        .extract("firstName")
        .validate(value);
      if (
        validatedFirstName.error &&
        validatedFirstName.error.details[0].type === "string.empty"
      ) {
        setFirstNameError({
          helperText: "First Name cannot be empty",
          error: true,
        });
      } else if (
        validatedFirstName.error &&
        validatedFirstName.error.details[0].type === "string.pattern.base"
      ) {
        setFirstNameError({
          helperText:
            "First Name must contain only Alphanumeric characters (A-Z,a-z,0-9)",
          error: true,
        });
      } else {
        setFirstNameError({ helperText: "", error: false });
      }
    }
    if (name === "lastName") {
      //lastName Validation
      const validatedLastName = userSchema.extract("lastName").validate(value);
      if (
        validatedLastName.error &&
        validatedLastName.error.details[0].type === "string.empty"
      ) {
        setLastNameError({
          helperText: "Last Name cannot be empty",
          error: true,
        });
      } else if (
        validatedLastName.error &&
        validatedLastName.error.details[0].type === "string.pattern.base"
      ) {
        setLastNameError({
          helperText:
            "Last Name must contain only Alphanumeric characters (A-Z,a-z,0-9)",
          error: true,
        });
      } else {
        setLastNameError({ helperText: "", error: false });
      }
    }
    if (name === "confirmPassword") {
      // Confirm password validation
      const validatedConfirmPassword = userSchema
        .extract("confirmPassword")
        .validate(value);
      if (
        validatedConfirmPassword.error &&
        validatedConfirmPassword.error.details[0].type === "string.empty"
      ) {
        setConfirmPasswordError({
          helperText: "Confirm Password cannot be empty",
          error: true,
        });
      } else {
        setConfirmPasswordError({ helperText: "", error: false });
      }
    }
  }
}
