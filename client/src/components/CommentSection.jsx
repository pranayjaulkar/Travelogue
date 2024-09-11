import { useState } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../actions/posts";
import { useNavigate } from "react-router-dom";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";

export default function CommentSection({ currentPost }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.user);

  const handleSubmit = () => {
    if (user) {
      if (comment.trim() && currentPost) {
        const post = {
          ...currentPost,
          comments: currentPost.comments?.length
            ? [...currentPost.comments, { text: comment.trim(), owner: user._id }]
            : [{ text: comment.trim(), owner: user._id }],
        };

        dispatch(
          updatePost({
            post,
            accessToken: user.accessToken,
          })
        );
        setComment("");
      } else {
        setComment("");
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="tw-flex-wrap tw-py-4 tw-px-2 tw-text-gray-800">
      <div className="tw-space-y-2">
        <span className="tw-font-semibold ">Write a Comment</span>
        <TextField
          sx={{ marginBottom: "1rem" }}
          fullWidth
          minRows={4}
          variant="outlined"
          label="Comment"
          multiline
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button
          disabled={!comment}
          className="tw-w-full tw-px-4 tw-py-2 tw-rounded-md tw-text-white tw-bg-blue-500 hover:tw-bg-blue-600 tw-cursor-pointer tw-transition-all tw-duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <div className="tw-mt-8 tw-space-y-2">
        {!!currentPost?.comments?.length && (
          <span className="tw-font-semibold">Comments ({currentPost.comments.length})</span>
        )}
        <div className="tw-flex tw-flex-col tw-space-y-4">
          {currentPost?.comments?.map((comment) => (
            <div key={comment._id} className="tw-flex tw-flex-col">
              <div className="tw-flex tw-items-center">
                <AccountCircleSharpIcon />
                <span className="tw-font-medium tw-ml-2">{comment.owner?.email}</span>
              </div>
              <span className="tw-ml-8 tw-break-words tw-text-gray-600">{comment.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
