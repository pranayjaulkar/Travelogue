import axios from "axios";

let REACT_APP_BACKEND_API_URL;

if (process.env.NODE_ENV !== "production")
  REACT_APP_BACKEND_API_URL = "http://localhost:5000/api";
else REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

const API = axios.create({
  baseURL: REACT_APP_BACKEND_API_URL,
  withCredentials: true,
});

export const getPost = (_id) =>
  API({
    method: "get",
    url: `/posts/${_id}`,
  });

export const getPosts = (page) =>
  API({
    method: "get",
    url: `/posts?page=${page}`,
  });

export const getPostsBySearch = (searchQuery) =>
  API({
    method: "get",
    url: `/posts/search?q=${searchQuery.query || "none"}&tags=${
      searchQuery.tags
    }`,
  });

export const imageUpload = (formData, accessToken) =>
  API({
    method: "post",
    url: "/posts/images",
    data: formData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createPost = (post, accessToken) =>
  API({
    method: "post",
    url: `/posts`,
    data: post,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
export const updatePost = (id, post, accessToken) =>
  API({
    method: "patch",
    url: `/posts/${id}`,
    data: post,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
export const deletePost = (id, accessToken) =>
  API({
    method: "delete",
    url: `/posts/${id}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
export const likePost = (id, accessToken) =>
  API({
    method: "patch",
    url: `/posts/${id}/likePost`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const SignIn = (formData) => API.post("/users/signIn", formData);
export const SignUp = (formData) => API.post("/users/signUp", formData);
export const refreshAccessToken = () => API.get("/users/refresh");
export const logout = () => API.get("/users/logout");
