import { Card, CardActions, CardContent, CardMedia } from "@mui/material/";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import moment from "moment";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  return (
    <article>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "6px",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Image */}
        <CardMedia
          style={{
            minHeight: "214px",
            backgroundColor: "rgba(0,0,0,.5)",
            backgroundBlendMode: "darken",
          }}
          component={Link}
          to={`/posts/${post._id}`}
          image={
            post.images[0]?.path
              ? post.images[0].path
              : "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
          }
          title={post.title}
        ></CardMedia>

        {/* Title */}
        <div className="tw-absolute tw-top-5 tw-left-5 tw-text-white">
          <Link to={`/posts/${post._id}`}>
            <p className="tw-text-xl">{post.title}</p>
            <p>{moment(post.createdAt).fromNow()}</p>
          </Link>
        </div>

        {/* Like button */}
        <CardActions style={{ padding: "1rem 1rem 0 1rem" }}>
          <ThumbUpAltIcon className="tw-text-blue-500" fontSize="small" />
          <p className="tw-ml-1 tw-text-gray-500 tw-font-normal tw-text-sm">{post.likes.length}</p>
        </CardActions>
        <p className="tw-p-4 tw-py-0 tw-text-sm tw-font-normal">
          by {post.owner && post.owner.firstName + " " + post.owner.lastName}
        </p>

        {/* Description */}
        <CardContent style={{ padding: ".4rem 1rem", height: "100%" }}>
          <div>
            {post.message.length > 100 ? (
              <p className="tw-text-sm tw-font-normal tw-text-gray-500">
                {post.message.slice(0, 100) + "..."}
                <Link className="tw-text-blue-500 tw-lowercase" to={`/posts/${post._id}`}>
                  more
                </Link>
              </p>
            ) : (
              post.message
            )}
          </div>

          {/* tags */}
          {post.tags.length && (
            <div className="tw-flex tw-justify-between tw-mt-2">
              <p className="tw-text-sm tw-text-gray-500 tw-font-normal">{post.tags.map((tag) => `#${tag} `)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
