import { Chip } from "@mui/material";
import moment from "moment";
import { lazy, Suspense, useEffect, useState } from "react";
import { EDIT_CURRENT_POST } from "../constants/actionTypes.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPost } from "../api";

const RecommendedPosts = lazy(() => import("../components/RecommendedPosts.jsx"));
const CommentSection = lazy(() => import("../components/CommentSection.jsx"));
import PostPageSkeleton from "../components/PostPageSkeleton.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  ThumbUp as ThumbUpIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import SpinningLoader from "../components/SpinningLoader.jsx";
import { deletePost, likePost } from "../actions/posts.js";

export default function Post() {
  const { _id } = useParams();
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const [currentPost, setCurrentPost] = useState(null);
  const [noPostFound, setNoPostFound] = useState(false);
  const [liked, setLiked] = useState(currentPost?.likes.find((like) => like.toString() === user?._id));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [index, setIndex] = useState(0);
  let [open, setOpen] = useState(false);

  const handleEdit = () => {
    dispatch({ type: EDIT_CURRENT_POST, payload: currentPost });
  };

  const handleConfirm = () => {
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
        setLiked(true);
        currentPost.likes.push(user._id);
      } else {
        //if userid found in likes array then remove it from likes array
        setLiked(false);
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

  useEffect(() => {
    setCurrentPost(null);
    if (posts.currentPost) setCurrentPost(posts.currentPost);
    if (_id) {
      getPost(_id)
        .then((res) => setCurrentPost(res.data))
        .catch((error) => {
          import.meta.env.DEV && console.log("error: ", error);
          setNoPostFound(true);
        });
    }
  }, [_id, posts.currentPost]);

  if (noPostFound)
    return (
      <div className="tw-w-full tw-h-[700px] tw-flex tw-justify-center tw-items-center">
        <p className="tw-text-red-500 sm:tw-text-xl"> No Post Found with this id: {_id}</p>
      </div>
    );
  else if (!currentPost) return <PostPageSkeleton />;
  else
    return (
      <div className="tw-mt-8">
        <ConfirmDeleteModal open={open} setOpen={setOpen} onConfirm={handleConfirm} />
        <div className="tw-flex tw-justify-center tw-items-start tw-px-2 md:tw-px-8  tw-mb-4  tw-flex-col-reverse xl:tw-flex-row md:tw-mx-20 xl:tw-mx-28">
          {/* Details */}
          <div className=" tw-w-full tw-px-2 md:tw-px-4 xl:tw-px-0 xl:tw-w-[50%]">
            {/* Head */}
            <div className="tw-flex tw-flex-col tw-items-start tw-mb-6">
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
                {user && currentPost && currentPost.owner._id === user._id && (
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
                        setOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                )}
              </div>
              {/* Created by */}
              <span className="tw-font-semibold tw-flex tw-text-gray-800">
                Created by:
                {` ${currentPost.owner.firstName} ${currentPost.owner.lastName} (${currentPost.owner.email}
              )`}
              </span>
              {/* Message */}
              <p className=" tw-text-gray-600">{currentPost.message}</p>

              {/* TAGS */}
              <div className="tw-flex tw-text-gray-600 tw-space-x-2">
                {currentPost.tags.map((tag) => (
                  <div key={tag} className="tag">
                    <Chip label={`#${tag}`} component={Link} to={`/posts?q=none&tags=${tag}`} clickable />
                  </div>
                ))}
              </div>
            </div>
            {/* Comment section */}
            <Suspense
              fallback={
                <SpinningLoader
                  className="tw-flex tw-flex-grow tw-items-center tw-justify-center tw-min-h-[600px]"
                  size={40}
                />
              }
            >
              <CommentSection currentPost={currentPost} />
            </Suspense>
            <div className="tw-flex tw-h-full xl:tw-hidden">
              <Suspense
                fallback={
                  <SpinningLoader
                    className="tw-flex tw-flex-grow tw-items-center tw-justify-center tw-min-h-[600px]"
                    size={40}
                  />
                }
              >
                <RecommendedPosts currentPost={currentPost} />
              </Suspense>
            </div>
          </div>
          <div className="tw-flex tw-w-full xl:tw-w-[50%] tw-flex-col tw-items-center xl:tw-pl-8 tw-space-y-8">
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
                            className="tw-object-cover tw-bg-gray-100 tw-aspect-square"
                            src={image.path.replace("/upload/", "/upload/w_800/")}
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
            <div className="tw-hidden xl:tw-flex tw-w-full">
              <Suspense
                fallback={
                  <SpinningLoader
                    className="tw-flex tw-flex-grow tw-items-center tw-justify-center tw-min-h-[600px]"
                    size={40}
                  />
                }
              >
                <RecommendedPosts currentPost={currentPost} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    );
}
