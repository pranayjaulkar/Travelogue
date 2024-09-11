import { userSchema, postSchema } from "../schema";

//Joi Validation function to validate data
function postValidate({ formData, setValidationError }) {
  const validatedTitle = postSchema.extract("title").validate(formData.title);
  const validatedMessage = postSchema.extract("message").validate(formData.message);
  let error = false;

  if (validatedTitle?.error?.details[0]?.type === "string.empty") {
    setValidationError((prev) => ({ ...prev, title: { helperText: "Title cannot be empty", error: true } }));
    error = true;
  }
  if (validatedMessage.error?.details[0].type === "string.empty") {
    setValidationError((prev) => ({ ...prev, message: { helperText: "Message cannot be empty", error: true } }));
    error = true;
  }

  return error;
}

//Joi Validation function to validate data
function userValidate({ formData, isSignUp, setValidationError }) {
  //validation after submit
  let validationError = false;
  const validatedEmail = userSchema.extract("email").validate(formData.email);
  const validatedPassword = userSchema.extract("password").validate(formData.password);
  const validatedFirstName = userSchema.extract("firstName").validate(formData.firstName);
  const validatedLastName = userSchema.extract("lastName").validate(formData.lastName);
  const validatedConfirmPassword = userSchema.extract("confirmPassword").validate(formData.confirmPassword);

  if (isSignUp) {
    //firstName Validation
    if (validatedFirstName.error?.details[0].type === "string.empty") {
      setValidationError((prev) => ({
        ...prev,
        firstName: {
          helperText: "First Name cannot be empty",
          error: true,
        },
      }));
      validationError = true;
    } else if (validatedFirstName.error?.details[0].type === "string.pattern.base") {
      setValidationError((prev) => ({
        ...prev,
        firstName: {
          helperText: "First Name must contain only Alphanumeric characters (A-Z,a-z,0-9)",
          error: true,
        },
      }));
      validationError = true;
    }

    //lastName Validation
    if (validatedLastName.error?.details[0].type === "string.empty") {
      setValidationError((prev) => ({
        ...prev,
        lastName: {
          helperText: "Last Name cannot be empty",
          error: true,
        },
      }));
      validationError = true;
    } else if (validatedLastName.error?.details[0].type === "string.pattern.base") {
      setValidationError((prev) => ({
        ...prev,
        lastName: {
          helperText: "Last Name must contain only Alphanumeric characters (A-Z,a-z,0-9)",
          error: true,
        },
      }));
      validationError = true;
    }

    // Confirm password validation
    if (validatedConfirmPassword.value !== validatedPassword.value) {
      setValidationError((prev) => ({
        ...prev,
        confirmPassword: {
          helperText: "Passwords don't match.",
          error: true,
        },
      }));
      validationError = true;
    } else if (validatedConfirmPassword.error?.details[0].type === "string.empty") {
      setValidationError((prev) => ({
        ...prev,
        confirmPassword: {
          helperText: "Confirm Password cannot be empty",
          error: true,
        },
      }));
      validationError = true;
    }
  }
  // Email Validation
  if (validatedEmail.error?.details[0].type === "string.email") {
    setValidationError((prev) => ({ ...prev, email: { helperText: "Invalid Email", error: true } }));
    validationError = true;
  } else if (validatedEmail.error?.details[0].type === "string.empty") {
    setValidationError((prev) => ({ ...prev, email: { helperText: "Email cannot be empty", error: true } }));
    validationError = true;
  }

  // password validation
  if (validatedPassword.error?.details[0].type === "string.empty") {
    setValidationError((prev) => ({ ...prev, password: { helperText: "Password cannot be empty", error: true } }));
    validationError = true;
  } else if (validatedPassword.error?.details[0].type === "string.pattern.base") {
    setValidationError((prev) => ({
      ...prev,
      password: {
        helperText: "Password must contain 8 characters (A-Z,a-z,0-9) and should not contain special characters.",
        error: true,
      },
    }));
    validationError = true;
  }

  return validationError;
}

export { userValidate, postValidate };
