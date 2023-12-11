import { useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../actions/posts";
import "./PostDetails.css";
import { useNavigate } from "react-router-dom";

export default function CommentSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.user);
  const currentPost = useSelector((state) => state.posts.currentPost);

  const handleClick = () => {
    //If user is logged in
    if (user) {
      //create comment object to link to user and post
      if (comment.trim()) {
        const newComment = { text: comment.trim(), owner: user._id };
        const previousCommentsArray = currentPost.comments;
        const post = {
          ...currentPost,
          comments: [...previousCommentsArray, newComment],
        };
        dispatch(
          updatePost({
            updateCurrentPost: true,
            post,
            accessToken: user.accessToken,
          })
        );
      } else {
        setComment("");
      }
    } else {
      navigate("/auth");
    }
  };
  return (
    <div className="commentsOuterContainer">
      <div className="commentsContainer">
        <Typography sx={{ fontWeight: "700" }}>Comments:-</Typography>
        {currentPost.comments &&
          currentPost.comments.map((comment) => (
            <div key={comment._id} className="single_comment">
              <Typography className="username" sx={{ fontWeight: "bold" }}>
                {comment.owner.email}
              </Typography>
              <Typography className="comment">{comment.text}</Typography>
            </div>
          ))}
      </div>
      <div className="commentBoxContainer">
        <Typography className="commentBoxPrompt">Write a Comment</Typography>
        <TextField
          className="commentBox"
          sx={{ marginBottom: "1rem" }}
          fullWidth
          minRows={4}
          variant="outlined"
          label="Comment"
          multiline
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <Button
          className="submitButton"
          fullWidth
          disabled={!comment}
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
