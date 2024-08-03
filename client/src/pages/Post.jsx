import { Chip } from "@mui/material";
import moment from "moment";
import CommentSection from "../components/CommentSection.jsx";
import { EDIT_CURRENT_POST } from "../constants/actionTypes.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPost } from "../actions/posts.js";
import RecommendedPosts from "../components/RecommendedPosts.jsx";

import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  ThumbUp as ThumbUpIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import SpinningLoader from "../components/SpinningLoader.jsx";
import { Typography } from "@mui/material";
import { deletePost, likePost, getRecommendedPosts } from "../actions/posts.js";

export default function Post() {
  const { _id } = useParams();
  let { posts, recommendedPosts, isLoading, currentPost } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [index, setIndex] = useState(0);
  let [surePrompt, setSurePrompt] = useState(false);

  const handleEdit = () => {
    dispatch({ type: EDIT_CURRENT_POST, payload: currentPost });
  };

  const handleDeleteConfirm = () => {
    if (user && user._id === currentPost.owner._id) {
      dispatch(deletePost(currentPost._id, navigate, user.accessToken));
    } else {
      navigate("/auth");
    }
  };

  const handleLike = () => {
    if (user) {
      let index = -1;
      //if posts has likes then search for userid in likes.
      if (currentPost.likes.length) {
        index = currentPost.likes.findIndex((_id) => _id.toString() === user._id);
      }
      //if userId is not found in likes array then add it
      if (index === -1) {
        currentPost.likes.push(user._id);
      } else {
        //if userid found in likes array then remove it from likes array
        currentPost.likes = currentPost.likes.filter((_id) => _id.toString() !== user._id);
      }
      dispatch(likePost(currentPost, user.accessToken));
    } else {
      navigate("/auth");
    }
  };

  const handleLeftClick = () => {
    index === 0 ? setIndex(currentPost.images.length - 1) : setIndex(--index);
  };

  const handleRightClick = () => {
    index === currentPost.images.length - 1 ? setIndex(0) : setIndex(++index);
  };

  let liked = currentPost?.likes.find((like) => like.toString() === user?._id.toString());

  useEffect(() => {
    dispatch(getPost(_id, navigate));
  }, [_id, dispatch, navigate]);

  useEffect(() => {
    if (currentPost) {
      dispatch(getRecommendedPosts(currentPost.tags));
    }
  }, [currentPost]);

  return isLoading || !currentPost ? (
    <SpinningLoader className="tw-flex tw-flex-grow tw-items-center tw-justify-center tw-min-h-[600px]" size={40} />
  ) : (
    <div className="tw-mt-8">
      {surePrompt && (
        <div className="tw-flex tw-justify-center tw-items-center tw-fixed tw-top-0 tw-left-0 tw-bottom-0 tw-right-0 tw-z-10 tw-bg-[rgba(0,0,0,0.5)] ">
          <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4 tw-rounded-md tw-bg-white">
            <Typography>Are you sure you want to delete this Post?</Typography>
            <div className="tw-flex tw-justify-around tw-items-center tw-w-full">
              <button
                onClick={() => {
                  setSurePrompt(false);
                }}
                className="tw-px-4 tw-py-1 tw-text-gray-700 hover:tw-bg-gray-200 tw-border tw-rounded-md tw-flex tw-justify-center tw-items-center tw-my-2 tw-mx-4 tw-transition-all tw-duration-300 "
              >
                Cancel
              </button>
              <button
                className="tw-px-4 tw-py-1 tw-text-white tw-bg-red-500 hover:tw-bg-red-700 tw-border tw-rounded-md tw-flex tw-justify-center tw-items-center tw-my-2 tw-mx-4 tw-transition-all tw-duration-300 "
                onClick={handleDeleteConfirm}
                color="error"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="tw-flex tw-justify-center tw-items-start tw-px-2 md:tw-px-8  tw-mb-4  tw-flex-col-reverse xl:tw-flex-row md:tw-mx-20 xl:tw-mx-28">
        {/* Details */}
        <div className=" tw-w-full tw-px-2 md:tw-px-4 xl:tw-px-0  xl:tw-w-[50%]">
          <div className="tw-flex tw-flex-col tw-items-start tw-mb-6">
            {/* Head */}
            <div className="tw-m-2">
              {/* Title */}
              <h1 className="tw-text-3xl md:tw-text-5xl ">{currentPost.title}</h1>
              {/* created at */}
              <span className="tw-text-gray-500">{moment(currentPost.createdAt).fromNow()}</span>
            </div>
          </div>

          {/* body */}
          <div className="tw-flex tw-flex-col tw-px-2 tw-text-gray-600 tw-space-y-2">
            {/* actions */}
            <div className="tw-w-full tw-flex tw-justify-between tw-items-center  tw-space-x-3 tw-text-blue-500">
              <div className="tw-flex tw-space-x-3">
                {/* Like */}
                <ThumbUpIcon className="tw-cursor-pointer " onClick={handleLike} />
                <span className="tw-text-gray-600">
                  {liked
                    ? currentPost.likes.length > 1
                      ? "You and " + (currentPost.likes.length - 1) + " Others"
                      : "You liked this post"
                    : currentPost.likes.length > 1
                    ? currentPost.likes.length + " Likes"
                    : currentPost.likes.length + " Like"}
                </span>
              </div>

              {/* Edit */}
              {user?._id === currentPost.owner._id && (
                <div className="tw-flex tw-space-x-3">
                  <Link
                    className="tw-flex tw-justify-end tw-items-center tw-cursor-pointer"
                    onClick={handleEdit}
                    to={`/posts/${currentPost._id}/edit`}
                  >
                    <EditIcon />
                  </Link>
                  <div
                    className="tw-flex tw-justify-end tw-items-center tw-cursor-pointer "
                    onClick={() => {
                      setSurePrompt(true);
                    }}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              )}
            </div>
            {/* Created by */}
            <span className="tw-font-semibold tw-text-sm tw-text-gray-800">
              Created by:
              {` ${currentPost.owner.firstName} ${currentPost.owner.lastName} (${currentPost.owner.email})`}
            </span>
            {/* Message */}
            <p className=" tw-text-gray-600">{currentPost.message}</p>

            {/* TAGS */}
            <div className="tw-flex tw-text-gray-600 tw-space-x-2">
              {currentPost?.tags.map((tag) => (
                <div key={tag} className="tag">
                  <Chip label={`#${tag}`} component={Link} to={`/posts?q=none&tags=${tag}`} clickable />
                </div>
              ))}
            </div>
          </div>
          {/* Comment section */}
          <CommentSection />
          <div className="tw-flex xl:tw-hidden">
            <RecommendedPosts posts={posts} recommendedPosts={recommendedPosts} currentPost={currentPost} />
          </div>
        </div>
        <div className="tw-flex xl:tw-w-[50%] tw-flex-col tw-items-center xl:tw-pl-8 tw-space-y-8">
          {/* Images */}
          <div className="tw-p-4 tw-w-full tw-h-full">
            <div className="tw-w-full tw-h-full tw-relative tw-bg-gray-100 tw-rounded-md tw-overflow-hidden">
              {currentPost.images.length > 1 && (
                <div>
                  <div
                    className="tw-absolute tw-z-10 tw-bottom-0 tw-top-0 tw-w-[8%] tw-flex tw-justify-center tw-items-center hover:tw-bg-[rgba(12,10,10,0.05)] tw-transition-all tw-duration-300 tw-select-none"
                    onClick={handleLeftClick}
                  >
                    <ArrowBackIcon />
                  </div>
                  <div
                    className="tw-absolute tw-z-10 tw-right-0 tw-bottom-0 tw-top-0 tw-w-[8%] tw-flex tw-justify-center tw-items-center hover:tw-bg-[rgba(0,0,0,0.05)] tw-transition-all tw-duration-300 tw-select-none"
                    onClick={handleRightClick}
                  >
                    <ArrowForwardIcon />
                  </div>
                </div>
              )}

              {/* Carousel */}
              <div className="tw-w-full tw-h-full tw-flex tw-justify-start tw-items-center tw-overflow-hidden">
                <div
                  className="tw-flex tw-justify-start tw-items-center tw-h-full tw-transition-all tw-duration-300 tw-max-h-[650px]"
                  style={{
                    transform: `translate(${index * (-100 / currentPost.images.length)}%)`,
                    minWidth: `${currentPost.images.length * 100}%`,
                  }}
                >
                  {currentPost.images.length ? (
                    currentPost.images.map((image) => (
                      <div
                        key={image.filename}
                        className="tw-flex tw-h-full tw-justify-center tw-items-center "
                        style={{ width: `${100 / currentPost.images.length}%` }}
                      >
                        <img
                          className="tw-w-full tw-h-full tw-object-contain"
                          src={image.path.replace("/upload/", "/upload/w_1000/")}
                          alt=""
                        />
                      </div>
                    ))
                  ) : (
                    <img
                      className="tw-rounded-md tw-object-cover tw-w-full tw-max-w-xl"
                      src="https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
                      alt={currentPost.title}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Recommended Posts */}
          <div className="tw-hidden xl:tw-flex">
            <RecommendedPosts posts={posts} recommendedPosts={recommendedPosts} currentPost={currentPost} />
          </div>
        </div>
      </div>
    </div>
  );
}
