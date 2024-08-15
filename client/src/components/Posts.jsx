import { useSelector } from "react-redux";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";

export default function Posts() {
  const { posts, isLoading } = useSelector((state) => state.posts);
  let postSkeletons = [];
  const postSkeleton = {};
  for (let i = 0; i < 10; i++) {
    postSkeletons.push(postSkeleton);
  }

  if (!posts || (!posts.length && !isLoading)) {
    return <div className="tw-m-auto tw-min-w-52 tw-min-h-36">No Posts found</div>;
  }

  return (
    <div id="posts" className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-5 tw-gap-4">
      {!!posts.length && posts.map((post, i) => <Post key={i} post={post} />)}
      {!posts.length && postSkeletons.map((p, i) => <PostSkeleton key={i} />)}
    </div>
  );
}
