import { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";
import { updatePost, createPost } from "../../actions/posts";
import { postSchema } from "../../schema/schema";
import "./Form.css";
export default function Form({ currentId, setCurrentId }) {
  const emptyForm = {
    title: "",
    message: "",
    tags: [],
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const user = useSelector((state) => state.user);
  const [titleError, setTitleError] = useState({
    error: false,
    helperText: "",
  });
  const [messageError, setMessageError] = useState({
    error: false,
    helperText: "",
  });
  const EditPost = useSelector((state) => {
    const { posts } = state.posts;
    return currentId ? posts.find((post) => post._id === currentId) : null;
  });

  //Joi Validation function to validate data
  const validate = ({ name, string, postData }) => {
    //validation after submit
    if (postData) {
      //Title Validation
      const validatedTitle = postSchema
        .extract("title")
        .validate(postData.title);
      if (
        validatedTitle.error &&
        validatedTitle.error.details[0].type === "string.empty"
      ) {
        setTitleError({ helperText: "Title cannot be empty", error: true });
      } else {
        setPostData({
          ...postData,
          title: validatedTitle.value,
        });
        setTitleError({ ...titleError, error: false });
      }
      //Message Validation
      const validatedMessage = postSchema
        .extract("message")
        .validate(postData.message);
      if (
        validatedMessage.error &&
        validatedMessage.error.details[0].type === "string.empty"
      ) {
        setMessageError({ helperText: "Message cannot be empty", error: true });
      } else {
        setPostData({
          ...postData,
          message: validatedMessage.value,
        });
        setMessageError({ ...titleError, error: false });
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
  };

  const clear = () => {
    setCurrentId(null);
    setPostData(emptyForm);
  };

  const handleImageChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    validate({ name, string: value });
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //make user owner of post
    let err;
    if (postData.owner && postData.owner._id) {
      err = validate({ postData });
    } else {
      postData.owner = user._id;
      err = validate({ postData });
    }
    // handle validation error
    if (!err) {
      let imagesExists = false;
      const imgData = new FormData();
      if (selectedFiles.length) {
        for (let image of selectedFiles) {
          imgData.append("images", image, image.name);
        }
        imagesExists = true;
      }
      //if user is logged in and user is owner of post
      // then update Post
      if (currentId && postData.owner._id === user._id) {
        dispatch(
          updatePost({
            imagesExists,
            imgData,
            post: postData,
            navigate,
            accessToken: user.accessToken,
          })
        );
      }
      //if user is logged in
      // Create Post
      else if (user) {
        //create post
        dispatch(
          createPost({
            imagesExists, //boolean
            imgData,
            post: postData,
            accessToken: user.accessToken,
            navigate,
          })
        );
      } else {
        navigate("/auth");
      }
    }
  };

  useEffect(() => {
    if (EditPost) {
      setPostData(EditPost);
    }
  }, [EditPost]);

  return (
    <Paper className="paper">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        noValidate
        className="root form"
      >
        <Typography variant="h6">
          {currentId ? `Editing ${EditPost.title}` : "Creating a Memory"}
        </Typography>
        {/* TITLE */}
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          error={titleError.error}
          helperText={titleError.helperText}
          fullWidth
          required
          value={postData.title}
          onChange={handleOnChange}
        ></TextField>
        {/* MESSAGE */}
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          error={messageError.error}
          helperText={messageError.helperText}
          fullWidth
          required
          value={postData.message}
          onChange={handleOnChange}
        ></TextField>
        {/* TAGS */}
        <MuiChipsInput
          className="chipInput"
          value={postData.tags}
          label="Tags"
          onChange={(tagList) => setPostData({ ...postData, tags: tagList })}
        />
        <div className="fileInput">
          <input
            multiple
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleImageChange}
          />
        </div>
        <Button
          className="buttonSubmit"
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
}
