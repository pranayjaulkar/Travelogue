import Post from "./Post/Post";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import "./Posts.css";

export default function Posts({ setCurrentId }) {
  const { posts, isLoading } = useSelector((state) => state.posts);
  if (!posts || (!posts.length && !isLoading)) {
    return "No Posts found";
  }

  return (
    <Grid
      className="container"
      sx={{ justifyContent: "center", margin: "0rem",width: "100%"}}
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts.map((post) => (
        <Grid
          sx={{ padding: "1rem !important" }}
          key={post._id}
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={3}
        >
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
}
