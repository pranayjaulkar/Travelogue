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
  EDIT_CURRENT_POST,
  CLEAR_EDIT_POST,
} from "../constants/actionTypes";
const defaultPostsObj = {
  posts: [],
  currentPage: 1,
  noOfPages: 1,
  isLoading: false,
  currentPost: null,
  editPost: null,
};
export default function reducer(postsObj = defaultPostsObj, action) {
  switch (action.type) {
    case FETCH_POST:
      return { ...postsObj, currentPost: action.payload };

    case FETCH_ALL_POSTS:
      return {
        ...postsObj,
        posts: action.payload.posts,
        currentPage: action.payload.currentPage,
        noOfPages: action.payload.noOfPages,
      };

    case FETCH_BY_SEARCH:
      return {
        ...postsObj,
        posts: action.payload,
      };

    case CREATE:
      return {
        ...postsObj,
        posts: [...postsObj.posts, action.payload],
      };

    case UPDATE:
      return {
        ...postsObj,
        posts: postsObj.posts.map((post) =>
          post._id === action.payload._id ? (post = action.payload) : post
        ),
      };

    case UPDATE_CURRENT_POST:
      return {
        ...postsObj,
        currentPost: action.payload,
      };

    case EDIT_CURRENT_POST:
      return {
        ...postsObj,
        editPost: action.payload,
      };

    case CLEAR_EDIT_POST:
      return {
        ...postsObj,
        editPost: null,
      };

    case DELETE:
      return {
        ...postsObj,
        posts: postsObj.posts.filter((post) => post._id !== action.payload),
      };

    case START_LOADING:
      return { ...postsObj, isLoading: true };

    case STOP_LOADING:
      return { ...postsObj, isLoading: false };

    default:
      return postsObj;
  }
}
