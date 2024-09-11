import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import SpinningLoader from "../components/SpinningLoader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost, createPost } from "../actions/posts";
import { getPost } from "../api";
import errorHandler from "../utils/errorHandler";

import { MuiChipsInput } from "mui-chips-input";
import { postValidate } from "../utils/validate";
import { SOMETHING_WENT_WRONG } from "../constants/actionTypes";
import { DeleteOutlined as Delete } from "@mui/icons-material/";

export default function Create() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { currentPost, isLoading } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const [edit, setEdit] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({ title: "", message: "", tags: [] });
  const [validationError, setValidationError] = useState({
    title: {
      error: false,
      helperText: "",
    },
    message: {
      error: false,
      helperText: "",
    },
  });

  const handleImageDelete = (path) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((img) => img.path !== path) }));
  };

  const handleImageChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleOnChange = (event) => {
    try {
      const { name, value } = event.target;
      if (validationError[event.target.name].error) {
        setValidationError((prev) => ({ ...prev, [event.target.name]: { error: false, helperText: "" } }));
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    } catch (error) {
      dispatch({ type: SOMETHING_WENT_WRONG, payload: { type: SOMETHING_WENT_WRONG, message: error.message } });
      import.meta.env.DEV && console.log("error: ", error);
    }
  };

  const handleSubmit = (event) => {
    try {
      event.preventDefault();

      if (!user) navigate("/auth");

      const err = postValidate({
        formData,
        setValidationError,
      });

      // handle validation error
      if (!err) {
        let imagesExists = !!selectedFiles.length;
        const imageData = new FormData();
        if (imagesExists) {
          for (let image of selectedFiles) {
            imageData.append("images", image, image.name);
          }
        }

        if (edit && formData.owner?._id === user._id) {
          dispatch(
            updatePost({
              imageData,
              post: { ...formData },
              accessToken: user.accessToken,
              navigate,
            })
          );
        } else {
          dispatch(
            createPost({
              imageData,
              post: { ...formData, owner: user._id },
              accessToken: user.accessToken,
              navigate,
            })
          );
        }
      }
    } catch (error) {
      dispatch({ type: SOMETHING_WENT_WRONG, payload: { error: error, message: error.message } });
      import.meta.env.DEV && console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (user && formData.owner && user._id !== formData.owner._id) {
      navigate(`/posts/${params._id}`);
    }
  }, [formData, user]);

  useEffect(() => {
    if (params._id) {
      setEdit(true);
      if (!currentPost)
        getPost(params._id)
          .then((res) => {
            if (res.data) {
              setFormData(res.data);
            } else {
              errorHandler({ dispatch });
            }
          })
          .catch((error) => {
            errorHandler({ dispatch, error });
            import.meta.env.DEV && console.log("error: ", error);
          });
      else setFormData(currentPost);
    }
  }, []);

  return (
    <div className="tw-flex tw-min-h-[500px] tw-items-center tw-justify-center">
      {isLoading ? (
        <SpinningLoader />
      ) : (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          noValidate
          className="root tw-w-full md:tw-w-[600px] lg:tw-w-[700px] tw-flex tw-flex-col tw-items-center tw-justify-start tw-p-8 md:tw-px-4 tw-pt-16 tw-space-y-4 md:tw-space-y-6"
        >
          <h2 className="tw-text-3xl tw-font-medium">{!edit ? "Create a Memory" : `Editing ${formData.title}`}</h2>

          {/* TITLE */}
          <TextField
            name="title"
            variant="outlined"
            label="Title"
            error={validationError.title.error}
            helperText={validationError.title.helperText}
            fullWidth
            required
            value={formData.title}
            onChange={handleOnChange}
          ></TextField>

          {/* MESSAGE */}
          <TextField
            name="message"
            variant="outlined"
            rows={4}
            label="Message"
            error={validationError.message.error}
            helperText={validationError.message.helperText}
            fullWidth
            required
            value={formData.message}
            onChange={handleOnChange}
          ></TextField>

          {/* TAGS */}
          <MuiChipsInput
            className="tw-w-full"
            value={formData.tags}
            label="Tags"
            onChange={(tagList) => setFormData({ ...formData, tags: tagList })}
          />
          <div className="tw-grid tw-grid-cols-3 tw-gap-2">
            {formData?.images?.map((image) => (
              <div key={image.filename} className="tw-relative tw-bg-gray-200">
                <Delete
                  onClick={() => handleImageDelete(image.path)}
                  className="tw-absolute tw-cursor-pointer tw-right-0 tw-mr-2 tw-mt-2"
                />
                <img
                  className="tw-min-w-44 tw-w-full tw-h-full tw-object-contain"
                  src={image.path.replace("/upload/", "/upload/w_250/")}
                  alt=""
                />
              </div>
            ))}
          </div>
          <div className="tw-w-full">
            <input
              multiple
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
            />
          </div>
          <Button variant="contained" color="primary" size="large" type="submit" fullWidth>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
