import { getRecommendedPosts } from "../actions/posts";
import { useState, useEffect } from "react";
import { SOMETHING_WENT_WRONG } from "../constants/actionTypes";

import Post from "./Post";
import { useDispatch } from "react-redux";

export default function RecommendedPosts({ currentPost }) {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentPost) {
      getRecommendedPosts(currentPost?.tags)
        .then((posts) => setRecommendedPosts(posts))
        .catch((error) => {
          dispatch({
            type: SOMETHING_WENT_WRONG,
            payload: {
              type: SOMETHING_WENT_WRONG,
              statusCode: error.response?.status,
              error,
              message: error.message,
            },
          });
        });
    }
  }, [currentPost]);

  return (
    <div id="RecommendedPosts" className="tw-w-full">
      {!!recommendedPosts?.length && (
        <div className={`tw-mb-8 ${recommendedPosts?.length ? "" : "tw-hidden"}`}>
          <div className="tw-grid xl:tw-px-6  tw-mt-4 xl:tw-mt-0 tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-2 tw-gap-4">
            {recommendedPosts.map((recommendedPost) =>
              recommendedPost._id !== currentPost?._id ? (
                <Post key={recommendedPost._id} post={recommendedPost} />
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
