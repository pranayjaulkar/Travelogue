import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";
import { updatePost, createPost } from "../../actions/posts";
import validate from "./validate";
import "./Create.css";
export default function Create() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const user = useSelector((state) => state.user);
  let { editPost, isLoading } = useSelector((state) => state.posts);
  const emptyFormData = { title: "", message: "", tags: [] };
  const [formData, setFormData] = useState(editPost ? editPost : emptyFormData);
  const [titleError, setTitleError] = useState({
    error: false,
    helperText: "",
  });
  const [messageError, setMessageError] = useState({
    error: false,
    helperText: "",
  });

  const handleImageChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    const opts = {
      name,
      string: value,
      titleError,
      messageError,
      setTitleError,
      setMessageError,
    };
    //validate while typing
    validate(opts);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //make user owner of post
    let err;
    const opts = {
      formData,
      setTitleError,
      setFormData,
      setMessageError,
      titleError,
      messageError,
    };
    if (formData.owner && formData.owner._id) {
      //edit post
      err = validate(opts);
    } else {
      //create post
      formData.owner = user._id;
      err = validate(opts);
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
      const options = {
        imagesExists, //boolean
        imgData,
        post: formData,
        accessToken: user.accessToken,
        navigate,
      };
      if (editPost && editPost.owner._id === user._id) {
        dispatch(updatePost(options));
      }
      // Create Post
      else if (user) {
        dispatch(createPost(options));
      } else {
        navigate("/auth");
      }
    }
  };

  useEffect(() => {
    if (!editPost) {
      setFormData(emptyFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPost]);

  return (
    <Paper
      className="paper"
      style={{
        alignItems: `${isLoading ? "center" : "flex-start"}`,
        border: "none",
        boxShadow: "none",
        margin: "1rem 2rem",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          noValidate
          className="root form "
        >
          <Typography variant="h6">
            {!editPost ? "Create a Memory" : `Editing ${formData.title}`}
          </Typography>
          {/* TITLE */}
          <TextField
            name="title"
            sx={{ marginBottom: "1rem" }}
            variant="outlined"
            label="Title"
            error={titleError.error}
            helperText={titleError.helperText}
            fullWidth
            required
            value={formData.title}
            onChange={handleOnChange}
          ></TextField>
          {/* MESSAGE */}
          <TextField
            name="message"
            sx={{ marginBottom: "1rem" }}
            variant="outlined"
            label="Message"
            error={messageError.error}
            helperText={messageError.helperText}
            fullWidth
            required
            value={formData.message}
            onChange={handleOnChange}
          ></TextField>
          {/* TAGS */}
          <MuiChipsInput
            className="chipInput"
            sx={{ marginBottom: "1rem" }}
            value={formData.tags}
            label="Tags"
            onChange={(tagList) => setFormData({ ...formData, tags: tagList })}
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
        </form>
      )}
    </Paper>
  );
}
