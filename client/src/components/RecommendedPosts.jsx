import Post from "./Post";

export default function RecommendedPosts({ recommendedPosts, currentPost }) {
  return (
    <div id="RecommendedPosts">
      {recommendedPosts?.length && (
        <div className={`tw-mb-8 ${recommendedPosts?.length ? "" : "tw-hidden"}`}>
          <div className="tw-grid xl:tw-px-6  tw-mt-4 xl:tw-mt-0 tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-2 tw-gap-4">
            {recommendedPosts.map((recommendedPost) =>
              recommendedPost._id !== currentPost._id ? <Post key={recommendedPost._id} post={recommendedPost} /> : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
