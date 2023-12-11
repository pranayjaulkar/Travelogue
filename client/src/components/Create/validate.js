import { postSchema } from "../../schema/schema";

//Joi Validation function to validate data
export default function validate({
  name,
  string,
  formData,
  setTitleError,
  setFormData,
  setMessageError,
  titleError,
  messageError,
}) {
  //validation after submit
  if (formData) {
    //Title Validation
    const validatedTitle = postSchema.extract("title").validate(formData.title);
    if (
      validatedTitle.error &&
      validatedTitle.error.details[0].type === "string.empty"
    ) {
      setTitleError({ helperText: "Title cannot be empty", error: true });
    } else {
      setFormData({
        ...formData,
        title: validatedTitle.value,
      });
      setTitleError({ ...titleError, error: false });
    }
    //Message Validation
    const validatedMessage = postSchema
      .extract("message")
      .validate(formData.message);
    if (
      validatedMessage.error &&
      validatedMessage.error.details[0].type === "string.empty"
    ) {
      setMessageError({ helperText: "Message cannot be empty", error: true });
    } else {
      setFormData({
        ...formData,
        message: validatedMessage.value,
      });
      setMessageError({ ...messageError, error: false });
    }

    if (validatedMessage.error || validatedTitle.error) {
      return true;
    }
    return false;
  }
  // validation while typing
  else {
    if (name === "title") {
      const title = string;
      const { error } = postSchema.extract("title").validate(title);
      if (error && error.details[0].type === "string.empty") {
        setTitleError({ helperText: "Title cannot be empty", error: true });
      } else {
        setTitleError({ helperText: "", error: false });
      }
    }
    if (name === "message") {
      const message = string;
      const { error } = postSchema.extract("message").validate(message);
      if (error && error.details[0].type === "string.empty") {
        setMessageError({
          helperText: "Message cannot be empty",
          error: true,
        });
      } else {
        setMessageError({ helperText: "", error: false });
      }
    }
  }
}
