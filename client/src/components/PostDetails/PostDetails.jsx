import { Chip } from "@mui/material";
import "./PostDetails.css";
import moment from "moment";
import CommentSection from "./CommentSection";
import { EDIT_CURRENT_POST } from "../../constants/actionTypes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPost } from "../../actions/posts.js";
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  ThumbUp as ThumbUpIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Paper,
  CircularProgress,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { deletePost, likePost } from "../../actions/posts";
export default function PostDetails() {
  const { _id } = useParams();
  let { posts, isLoading, currentPost } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [index, setIndex] = useState(0);
  // let recommendedPosts = posts.filter((post) => post !== currentPost);
  let [recommendedPosts, setRecommendedPosts] = useState([]);
  let [surePrompt, setSurePrompt] = useState(false);
  const handleEdit = () => {
    dispatch({ type: EDIT_CURRENT_POST, payload: currentPost });
  };
  const handleDelete = () => {
    if (user && user._id === currentPost.owner._id) {
      dispatch(deletePost(currentPost._id, navigate, user.accessToken));
    } else {
      navigate("/auth");
    }
  };
  const handleSurePrompt = () => {
    setSurePrompt((previousState) => !previousState);
  };
  const handleLike = () => {
    if (user) {
      let index = -1;
      //if posts has likes then search for userid in likes.
      if (currentPost.likes.length) {
        index = currentPost.likes.findIndex(
          (_id) => _id.toString() === user._id
        );
      }
      //if userId is not found in likes array then add it
      if (index === -1) {
        currentPost.likes.push(user._id);
      } else {
        //if userid found in likes array then remove it from likes array
        currentPost.likes = currentPost.likes.filter(
          (_id) => _id.toString() !== user._id
        );
      }
      dispatch(likePost(currentPost, navigate, user.accessToken));
    } else {
      navigate("/auth");
    }
  };
  const handleLeftClick = () => {
    if (index === 0) {
      setIndex(currentPost.images.length - 1);
    } else {
      setIndex(--index);
    }
  };
  const handleRightClick = () => {
    if (index === currentPost.images.length - 1) {
      setIndex(0);
    } else {
      setIndex(++index);
    }
  };
  let liked = false;
  if (currentPost && currentPost.likes) {
    for (let like of currentPost.likes) {
      if (user && like.toString() === user._id.toString()) {
        liked = true;
        break;
      }
    }
  }
  useEffect(() => {
    dispatch(getPost(_id, navigate));
  }, [_id, dispatch, navigate]);
  useEffect(() => {
    if (currentPost) {
      setRecommendedPosts(posts.filter((post) => post._id !== currentPost._id));
    }
  }, [posts, currentPost]);

  return isLoading || !currentPost ? (
    <Grid className="loading">
      <CircularProgress />
    </Grid>
  ) : (
    <>
      <Paper
        className="grow"
        sx={{ borderRadius: "0px", boxShadow: "none", marginTop: "1rem" }}
      >
        {surePrompt && (
          <div className="SurePromptOuterContainer">
            <div className="SurePromptInnerContainer">
              <Typography>
                Are you sure you want to delete this Post?
              </Typography>
              <div className="SurePromptOptionsContainer">
                <Button
                  onClick={handleSurePrompt}
                  className="SurePromptOptions"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className={`$"SurePromptOptions" $"danger"`}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
        <div
          className="  flex justify-center items-start mx-8 mb-4  flex-col-reverse xl:flex-row"
          style={{ boxShadow: "var(--lg-shadow)" }}
        >
          {/* Details */}
          <div className="section w-full xl:w-[40%]">
            <div className="header ">
              <div className="post_title">
                {/* Title */}
                <h1 className="main_title text-3xl md:text-5xl ">
                  {currentPost.title}
                </h1>
                {/* created at */}
                <span className="moment">
                  {moment(currentPost.createdAt).fromNow()}
                </span>
              </div>
              <div className="actions">
                {/* Edit */}
                {user && user._id === currentPost.owner._id && (
                  <>
                    <Link
                      className="edit mr-4"
                      onClick={handleEdit}
                      to={`/posts/${currentPost._id}/edit`}
                    >
                      <EditIcon />
                    </Link>
                    <div className="edit mr-4" onClick={handleSurePrompt}>
                      <DeleteIcon />
                    </div>
                  </>
                )}

                {/* Like */}
                <ThumbUpIcon className="like" onClick={handleLike} />
                <Typography>
                  {liked
                    ? currentPost.likes.length > 1
                      ? "You and " + (currentPost.likes.length - 1) + " Others"
                      : "You liked this post"
                    : currentPost.likes.length > 1
                    ? currentPost.likes.length + " Likes"
                    : currentPost.likes.length + " Like"}
                </Typography>
              </div>
            </div>

            {/* Name */}
            <span className="name">
              Created by:
              {` ${currentPost.owner.firstName} ${currentPost.owner.lastName} (${currentPost.owner.email})`}
            </span>
            {/* Message */}
            <p className="message">{currentPost.message}</p>

            {/* TAGS */}
            <div className="tags">
              {currentPost.tags &&
                currentPost.tags.map((tag) => (
                  <div key={tag} className="tag">
                    <Chip
                      label={`#${tag}`}
                      component={Link}
                      to={`/posts?q=none&tags=${tag}`}
                      clickable
                    />
                  </div>
                ))}
            </div>
            {/* Comment section */}
            <CommentSection />
          </div>
          {/* Image */}
          <div className="imageSection w-full xl:w-[60%] h-full lg:h-[650px]">
            {currentPost.images.length > 1 && (
              <div>
                <span
                  style={{
                    paddingLeft: "1rem",
                    height: "100%",
                    justifyContent: "flex-start",
                  }}
                  className="arrows"
                  onClick={handleLeftClick}
                >
                  <ArrowBackIcon className="arrowIcon" />
                </span>
                <span
                  style={{
                    paddingRight: "1rem",
                    right: "1rem",
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                  className="arrows"
                  onClick={handleRightClick}
                >
                  <ArrowForwardIcon className="arrowIcon" />
                </span>
              </div>
            )}
            {/* Carousel */}
            <div className="carousel">
              <div
                className="slider"
                style={{
                  transform: `translate(${
                    index * (-100 / currentPost.images.length)
                  }%)`,
                  minWidth: `${`${currentPost.images.length * 100}%`}`,
                }}
              >
                {currentPost.images.length ? (
                  currentPost.images.map((image) => (
                    <div
                      key={image.filename}
                      className="image"
                      style={{ width: `${100 / currentPost.images.length}%` }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        src={image.path.replace("/upload/", "/upload/w_1000/")}
                        alt=""
                      />
                    </div>
                  ))
                ) : (
                  <img
                    className="post_details_media"
                    src="https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
                    alt={currentPost.title}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Paper>
      {/* Recommended Posts */}
      {recommendedPosts.length && (
        <div className={`mb-8 ${posts?.length ? "" : "hidden"}`}>
          <Paper
            className="recommendedPosts   justify-center md:justify-start"
            sx={{ borderRadius: "0px", boxShadow: "var(--lg-shadow)" }}
          >
            {posts.map((post) => {
              if (post._id !== currentPost._id) {
                return (
                  <div
                    key={post._id}
                    className="recommendedPost "
                  >
                    <Link
                      key={post._id}
                      to={`/posts/${post._id}`}
                      className="link "
                      style={{
                        backgroundImage: `url(${
                          post.images.length
                            ? post.images[0].path.replace(
                                "/upload/",
                                "/upload/w_430/"
                              )
                            : "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
                        })`,
                      }}
                    >
                      {/* title */}
                      <h3 className="text-lg font-normal mt-4 ml-4">
                        {post.title}
                      </h3>
                    </Link>
                    {/* Name */}
                    <span className="text-md font-bold">
                      {post.owner.firstName + " " + post.owner.lastName}
                    </span>
                    {/* Likes */}
                    <div>
                      <ThumbUpIcon />
                      <span className="ml-2">{post.likes.length}</span>
                    </div>
                    {/* Likes */}
                    {post.message.length > 100 ? (
                      <Typography>
                        {post.message.slice(0, 100)}+{"..."}
                      </Typography>
                    ) : (
                      <Typography> post.message</Typography>
                    )}
                  </div>
                );
              } else return null;
            })}
          </Paper>
        </div>
      )}
    </>
  );
}
