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
  CLEAR_EDIT_POST,
} from "../constants/actionTypes";
import toast from "react-hot-toast";
export const getPost = (_id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.getPost(_id);
    dispatch({ type: FETCH_POST, payload: res.data });
    dispatch({ type: STOP_LOADING });
  } catch (error) {
    import.meta.env.DEV &&  console.log('error: ', error);
    const res = error.response;
    if (res?.data.error === NO_POST_FOUND) {
      dispatch({ type: NO_POST_FOUND });
    } else {
      dispatch({ type: STOP_LOADING });
      dispatch({
        type: SOMETHING_WENT_WRONG,
        payload: {
          type: SOMETHING_WENT_WRONG,
          statusCode: null,
          error,
          message: error.message,
        },
      });
    }
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.getPosts(page);
    dispatch({ type: FETCH_ALL_POSTS, payload: res.data });
    dispatch({ type: STOP_LOADING });
  } catch (error) {
    import.meta.env.DEV &&  console.log('error: ', error);
    dispatch({ type: STOP_LOADING });
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: {
        type: SOMETHING_WENT_WRONG,
        statusCode: null,
        error,
        message: error.message,
      },
    });
  }
};
export const getPostsBySearch = (searchQuery, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const res = await api.getPostsBySearch(searchQuery);
    //if res.data(posts array) array is empty then dispatch NO_POSTS_FOUND else dispatch FETCH_BY_SEARCH
    if (!res.data.length) {
      dispatch({ type: NO_POSTS_FOUND });
    } else {
      dispatch({ type: FETCH_BY_SEARCH, payload: res.data });
    }

    dispatch({ type: STOP_LOADING });
    navigate && navigate(`/posts/search?q=${searchQuery.query}&tags=${searchQuery.tags}`);
  } catch (error) {
    import.meta.env.DEV &&  console.log('error: ', error);
    const res = error.response;
    dispatch({ type: STOP_LOADING });
    if (res && res.status === 400 && res.data.error === "EMPTY_QUERY_PARAMETERS") {
      dispatch({ type: NO_POST_FOUND });
    } else {
      dispatch({
        type: SOMETHING_WENT_WRONG,
        payload: {
          type: SOMETHING_WENT_WRONG,
          statusCode: null,
          error,
          message: error.message,
        },
      });
    }
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
      if (imageData.has("images")) {
        const imgRes = await api.imageUpload(imageData, accessToken);
        //if image links array(imgres.data) is empty dispatch SOMETHING_WENT_WRONG else add image links array to post to upload to database
        if (!imgRes.data.length) {
          dispatch({
            type: SOMETHING_WENT_WRONG,
            payload: {
              type: SOMETHING_WENT_WRONG,
              statusCode: 500,
              error: null,
              message: "Something went wrong",
            },
          });
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

      dispatch({ type: CLEAR_EDIT_POST, payload: res.data });

      dispatch({ type: STOP_LOADING });
      toast.success("Post Created Successfully");
      //navigate to the post
      navigate && navigate(`/posts/${res.data._id}`);
    } catch (error) {
      import.meta.env.DEV &&  console.log('error: ', error);
      const res = error.response;
      dispatch({ type: STOP_LOADING });
      if (
        res &&
        res.status === 403 &&
        (res.data.error === "ACCESS_TOKEN_NOT_FOUND" || res.data.error === "TOKEN_EXPIRED")
      ) {
        navigate && navigate("/auth");
      } else {
        dispatch({
          type: SOMETHING_WENT_WRONG,
          payload: {
            type: SOMETHING_WENT_WRONG,
            statusCode: null,
            error,
            message: error.message,
          },
        });
      }
    }
  };

export const updatePost =
  ({ imageData, accessToken, post, navigate }) =>
  async (dispatch) => {
    try {
      dispatch({ type: START_LOADING });

      //Upload images to cloudinary and get response as image links array
      if (imageData.has("images")) {
        const imgRes = await api.imageUpload(imageData, accessToken);
        if (!imgRes.data) {
          dispatch({
            type: SOMETHING_WENT_WRONG,
            payload: {
              type: SOMETHING_WENT_WRONG,
              statusCode: null,
              error: null,
              message: "Something went wrong",
            },
          });
          dispatch({ type: STOP_LOADING });
        } else if (post?.images?.length) {
          post = { ...post, images: [...post.images, ...imgRes.data] };
        } else {
          post = { ...post, images: imgRes.data };
        }
      }

      const res = await api.updatePost(post._id, post, accessToken);

      dispatch({ type: UPDATE_CURRENT_POST, payload: res.data });
      dispatch({ type: CLEAR_EDIT_POST, payload: res.data });
      dispatch({ type: STOP_LOADING });

      toast.success("Post updated successfully");

      navigate && navigate(`/posts/${res.data._id}`);
    } catch (error) {
      import.meta.env.DEV &&  console.log('error: ', error);
      const res = error.response;
      dispatch({ type: STOP_LOADING });
      //if accesstoken not found or refresh token not found
      if (
        res &&
        res.status === 403 &&
        (res.data.error === "ACCESS_TOKEN_NOT_FOUND" || res.data.error === "TOKEN_EXPIRED")
      ) {
        navigate && navigate("/auth");
      } else {
        dispatch({
          type: SOMETHING_WENT_WRONG,
          payload: {
            type: SOMETHING_WENT_WRONG,
            statusCode: null,
            error,
            message: error.message,
          },
        });
      }
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
    import.meta.env.DEV &&  console.log('error: ', error);
    dispatch({ type: STOP_LOADING });
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: {
        type: SOMETHING_WENT_WRONG,
        statusCode: null,
        error,
        message: error.message,
      },
    });
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
    import.meta.env.DEV &&  console.log('error: ', error);
    dispatch({
      type: SOMETHING_WENT_WRONG,
      payload: {
        type: SOMETHING_WENT_WRONG,
        statusCode: null,
        error,
        message: error.message,
      },
    });
  }
};
