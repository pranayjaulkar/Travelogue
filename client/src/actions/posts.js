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
  SOMETHING_WENT_WRONG,
  NO_POSTS_FOUND,
  NO_POST_FOUND,
  UPDATE_CURRENT_POST,
} from "../constants/actionTypes";
export const getPost = (_id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.getPost(_id);
    if (res.data) {
      const res2 = await api.getPostsBySearch({ tags: res.data.tags });
      if (!res2.data.length) {
        dispatch({ type: NO_POSTS_FOUND });
      } else {
        dispatch({ type: FETCH_BY_SEARCH, payload: res2.data });
      }
    }
    dispatch({ type: FETCH_POST, payload: res.data });
    dispatch({ type: STOP_LOADING });
  } catch (error) {
    const res = error.response;
    if (res && res.status === 404) {
      dispatch({ type: NO_POST_FOUND });
    } else {
      dispatch({ type: STOP_LOADING });
      dispatch({
        type: SOMETHING_WENT_WRONG,
        payload: { name: error, message: error.message },
      });
      navigate("/error");
    }
  }
};
export const getPosts = (page, navigate) => async (dispatch) => {
  try {
    //Display Loading icon
    dispatch({ type: START_LOADING });
    const res = await api.getPosts(page);
    dispatch({ type: FETCH_ALL_POSTS, payload: res.data });
    // stop displaying Loading icon
    dispatch({ type: STOP_LOADING });
  } catch (error) {
    dispatch({ type: STOP_LOADING });
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: { error, message: error.message },
    });
    navigate("/error");
  }
};
export const getPostsBySearch = (searchQuery, navigate) => async (dispatch) => {
  try {
    //Display Loading icon
    dispatch({ type: START_LOADING });
    const res = await api.getPostsBySearch(searchQuery);
    //if res.data(posts array) array is empty then dispatch NO_POSTS_FOUND else dispatch FETCH_BY_SEARCH
    if (!res.data.length) {
      dispatch({ type: NO_POSTS_FOUND });
    } else {
      dispatch({ type: FETCH_BY_SEARCH, payload: res.data });
    }
    //Stop displaying Loading icon
    dispatch({ type: STOP_LOADING });
    navigate(`/posts/search?q=${searchQuery.query}&tags=${searchQuery.tags}`);
  } catch (error) {
    const res = error.response;
    dispatch({ type: STOP_LOADING });
    if (
      res &&
      res.status === 400 &&
      res.data.error === "EMPTY_QUERY_PARAMETERS"
    ) {
      dispatch({ type: NO_POST_FOUND });
    } else {
      dispatch({
        type: SOMETHING_WENT_WRONG,
        payload: { error, message: error.message },
      });
      navigate("/error");
    }
  }
};

export const createPost =
  ({ imagesExists, imgData, accessToken, post, navigate }) =>
  async (dispatch) => {
    try {
      //Display Loading icon
      dispatch({ type: START_LOADING });
      //Upload images to cloudinary and get response as image links array
      if (imagesExists) {
        const imgRes = await api.imageUpload(imgData, accessToken);
        //if image links array(imgres.data) is empty dispatch SOMETHING_WENT_WRONG else add image links array to post to upload to database
        if (!imgRes.data.length) {
          dispatch({ type: SOMETHING_WENT_WRONG });
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
      //navigate to the post
      navigate(`/posts/${res.data._id}`);
      //Stop displaying Loading icon
      dispatch({ type: STOP_LOADING });
    } catch (error) {
      const res = error.response;
      dispatch({ type: STOP_LOADING });
      if (
        res &&
        res.status === 403 &&
        (res.data.error === "ACCESS_TOKEN_NOT_FOUND" ||
          res.data.error === "TOKEN_EXPIRED")
      ) {
        navigate("/auth");
      } else {
        dispatch({
          type: SOMETHING_WENT_WRONG,
          payload: { error, message: error.message },
        });
        navigate("/error");
      }
    }
  };

export const updatePost =
  ({ updateCurrentPost, imagesExists, imgData, accessToken, post, navigate }) =>
  async (dispatch) => {
    try {
      dispatch({ type: START_LOADING });
      //Upload images to cloudinary and get response as image links array
      if (imagesExists) {
        const imgRes = await api.imageUpload(imgData, accessToken);
        if (!imgRes.data) {
          dispatch({ type: SOMETHING_WENT_WRONG });
          dispatch({ type: STOP_LOADING });
        } else if (post.images && post.images.length) {
          post = { ...post, images: [...post.images, ...imgRes.data] };
        } else {
          post = { ...post, images: imgRes.data };
        }
      }
      const res = await api.updatePost(post._id, post, accessToken);
      //update state
      //if updateCurrentPost is true then update current post
      if (updateCurrentPost) {
        dispatch({ type: UPDATE_CURRENT_POST, payload: res.data });
      }
      //if updateCurrentPost is false then update post
      else {
        dispatch({ type: UPDATE, payload: res.data });
      }
      navigate(`/posts/${res.data._id}`);
      dispatch({ type: STOP_LOADING });
    } catch (error) {
      const res = error.response;
      dispatch({ type: STOP_LOADING });
      //if accesstoken not found or refresh token not found
      if (
        res &&
        res.status === 403 &&
        (res.data.error === "ACCESS_TOKEN_NOT_FOUND" ||
          res.data.error === "TOKEN_EXPIRED")
      ) {
        navigate("/auth");
      } else {
        dispatch({
          type: SOMETHING_WENT_WRONG,
          payload: { error, message: error.message },
        });
        navigate("/error");
      }
    }
  };

export const deletePost = (_id, navigate, accessToken) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.deletePost(_id, accessToken);
    dispatch({ type: DELETE, payload: res.data._id });
    navigate("/");
  } catch (error) {
    dispatch({ type: STOP_LOADING });
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: { error, message: error.message },
    });
    navigate("/error");
  }
};

export const likePost = (post, navigate, accessToken) => async (dispatch) => {
  try {
    //update only ui like count
    dispatch({ type: UPDATE, payload: post });
    //update database like count
    const res = await api.likePost(post._id, accessToken);
    //update like count state after database update
    dispatch({ type: UPDATE, payload: res.data });
  } catch (error) {
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: { error, message: error.message },
    });
    navigate("/error");
  }
};
