import { Card, CardActions, CardContent, CardMedia } from "@mui/material/";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import moment from "moment";
import FallbackImage from "../assets/images/fallback-image.png";
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
          image={post.images[0]?.path ? post.images[0].path.replace("/upload/", "/upload/w_400/") : FallbackImage}
          title={post.title}
        ></CardMedia>

        {/* Title */}
        <div className="tw-absolute tw-top-5 tw-left-5 tw-text-white">
          <Link to={`/posts/${post._id}`}>
            <p className="tw-text-xl">{post.title}</p>
            <p>{moment(post.createdAt).fromNow()}</p>
          </Link>
        </div>
        <div className="tw-p-4 tw-grow">
          {/* Like button */}
          <CardActions sx={{ padding: "0rem" }}>
            <ThumbUpAltIcon className="tw-text-blue-500" fontSize="small" />
            <p className="tw-ml-1 tw-text-gray-500 tw-font-normal tw-text-sm">{post.likes.length}</p>
          </CardActions>
          <p className="tw-text-sm tw-font-normal">
            by {post.owner && post.owner.firstName + " " + post.owner.lastName}
          </p>

          {/* Description */}
          <CardContent style={{ padding: "0.4rem 0 0 0" }}>
            <div>
              {post.message.length > 100 ? (
                <p className="tw-text-sm tw-font-normal tw-text-gray-500">
                  {post.message.slice(0, 100) + "..."}
                  <Link className="tw-text-blue-500 tw-lowercase hover:tw-underline" to={`/posts/${post._id}`}>
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
        </div>
      </Card>
    </article>
  );
}
