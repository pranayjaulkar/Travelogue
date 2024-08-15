import * as api from "../api";
import {
  FETCH_ALL_POSTS,
  UPDATE,
  CREATE,
  DELETE,
  FETCH_BY_SEARCH,
  START_LOADING,
  STOP_LOADING,
  FETCH_POST,
  UPDATE_CURRENT_POST,
} from "../constants/actionTypes";
import toast from "react-hot-toast";
import errorHandler from "../utils/errorHandler";

export const getPost = (_id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.getPost(_id);
    dispatch({ type: FETCH_POST, payload: res.data });
    dispatch({ type: STOP_LOADING });
  } catch (error) {
    import.meta.env.DEV && console.log("error: ", error);
    dispatch({ type: STOP_LOADING });
    errorHandler({ dispatch, error });
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.getPosts(page);
    dispatch({ type: FETCH_ALL_POSTS, payload: res.data });
    dispatch({ type: STOP_LOADING });
  } catch (error) {
    import.meta.env.DEV && console.log("error: ", error);
    dispatch({ type: STOP_LOADING });
    errorHandler({ dispatch, error });
  }
};
export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.getPostsBySearch(searchQuery);
    //if res.data(posts array) array is empty then dispatch NO_POSTS_FOUND else dispatch FETCH_BY_SEARCH
    if (!res.data.length) {
      dispatch({ type: FETCH_BY_SEARCH, payload: res.data });
    }

    dispatch({ type: STOP_LOADING });
  } catch (error) {
    import.meta.env.DEV && console.log("error: ", error);
    dispatch({ type: STOP_LOADING });
    errorHandler({ dispatch, error });
  }
};

export const getRecommendedPosts = async (tags) => {
  const res = await api.getPostsBySearch({ tags });
  return res.data;
};

export const createPost =
  ({ imageData, accessToken, post, navigate }) =>
  async (dispatch) => {
    try {
      dispatch({ type: START_LOADING });
      //Upload images to cloudinary and get response as image links array

      if (imageData?.has("images")) {
        const imgRes = await api.imageUpload(imageData, accessToken);
        //if image links array(imgres.data) is empty dispatch SOMETHING_WENT_WRONG else add image links array to post to upload to database
        if (!imgRes.data.length) {
          errorHandler({ dispatch });
          dispatch({ type: STOP_LOADING });
        } else if (post.images && post.images.length) {
          post = { ...post, images: [...post.images, ...imgRes.data] };
        } else {
          post = { ...post, images: imgRes.data };
        }
      }
      //upload post to database
      const res = await api.createPost(post, accessToken);
      dispatch({ type: CREATE, payload: res.data });
      dispatch({ type: STOP_LOADING });
      toast.success("Post Created Successfully");
      //navigate to the post
      navigate && navigate(`/posts/${res.data._id}`);
    } catch (error) {
      import.meta.env.DEV && console.log("error: ", error);
      dispatch({ type: STOP_LOADING });
      errorHandler({ dispatch, error, navigate });
    }
  };

export const updatePost =
  ({ imageData, accessToken, post, navigate }) =>
  async (dispatch) => {
    try {
      dispatch({ type: START_LOADING });

      //Upload images to cloudinary and get response as image links array
      if (imageData?.has("images")) {
        const imgRes = await api.imageUpload(imageData, accessToken);
        if (!imgRes.data) {
          errorHandler({ dispatch });
          dispatch({ type: STOP_LOADING });
        } else if (post?.images?.length) {
          post = { ...post, images: [...post.images, ...imgRes.data] };
        } else {
          post = { ...post, images: imgRes.data };
        }
      }

      const res = await api.updatePost(post._id, post, accessToken);

      dispatch({ type: UPDATE_CURRENT_POST, payload: res.data });
      dispatch({ type: STOP_LOADING });

      navigate && navigate(`/posts/${res.data._id}`);
    } catch (error) {
      import.meta.env.DEV && console.log("error: ", error);
      dispatch({ type: STOP_LOADING });
      errorHandler({ dispatch, error, navigate });
    }
  };

export const deletePost = (_id, navigate, accessToken) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.deletePost(_id, accessToken);
    dispatch({ type: DELETE, payload: res.data._id });
    toast.success("Post deleted successfully");
    navigate && navigate("/");
  } catch (error) {
    import.meta.env.DEV && console.log("error: ", error);
    dispatch({ type: STOP_LOADING });
    errorHandler({ dispatch, error });
  }
};

export const likePost = (post, accessToken) => async (dispatch) => {
  try {
    //update only ui like count
    dispatch({ type: UPDATE, payload: post });
    //update database like count
    const res = await api.likePost(post._id, accessToken);
    //update like count state after database update
    dispatch({ type: UPDATE, payload: res.data });
  } catch (error) {
    import.meta.env.DEV && console.log("error: ", error);
    errorHandler({ dispatch, error });
  }
};
