import { Card, CardActions, CardContent } from "@mui/material/";
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
        <div className="tw-relative tw-w-full tw-h-52 tw-max-h-52 ">
          <Link className="tw-block tw-w-full tw-h-full" to={`/posts/${post._id}`}>
            <div
              style={{
                backgroundImage: `url(${
                  post.images[0]?.path ? post.images[0].path.replace("/upload/", "/upload/w_400/") : FallbackImage
                })`,
              }}
              className="tw-w-full tw-h-52 tw-max-h-52 tw-bg-blend-darken tw-bg-[rgba(0,0,0,0.4)] tw-bg-cover tw-bg-center"
            ></div>
          </Link>
          <Link className="tw-absolute tw-top-5 tw-left-5 tw-text-white" to={`/posts/${post._id}`}>
            <p className="tw-text-xl">{post.title}</p>
            <p>{moment(post.createdAt).fromNow()}</p>
          </Link>
        </div>

        {/* Title */}

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
