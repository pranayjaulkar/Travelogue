import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material/";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import moment from "moment";
import { Link } from "react-router-dom";
import "./Post.css";

export default function Post({ post }) {
  return (
    <Card className="card ">
      <CardMedia
        className="media"
        component={Link}
        to={`/posts/${post._id}`}
        image={
          post.images.length
            ? post.images[0].size / 1024 / 1024 > 1.0
              ? post.images[0].path.replace("/upload/", "/upload/w_1000/")
              : post.images[0].path
            : "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
        }
        title={post.title}
      ></CardMedia>
      <div className="overlay">
        <Link to={`/posts/${post._id}`}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </Link>
      </div>
      <Typography className="owner">
        by {post.owner && post.owner.firstName + " " + post.owner.lastName}
      </Typography>
      <CardActions className="cardActions">
        <ThumbUpAltIcon fontSize="small" />
        <Typography>&nbsp;Likes &nbsp; {post.likes.length}</Typography>
      </CardActions>
      <CardContent style={{ height: "100%" }}>
        <div>
          {post.message.length > 100 ? (
            <Typography variant="body2" color="textSecondary" component="p">
              {post.message.slice(0, 100) + "..."}
              <Link className="more" to={`/posts/${post._id}`}>
                more
              </Link>
            </Typography>
          ) : (
            post.message
          )}
        </div>
        {/* tags */}
        {post.tags.length ? (
          <div className="details">
            <Typography variant="body2" color="textSecondary" component="h2">
              {post.tags.map((tag) => `#${tag} `)}
            </Typography>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
