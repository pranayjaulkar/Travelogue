import { useSelector } from "react-redux";
import Post from "./Post";
import SkeletonPost from "./SkeletonPost";

export default function Posts() {
  const { posts, isLoading } = useSelector((state) => state.posts);
  let skeletonPosts = [];
  const skeletonPost = {};
  for (let i = 0; i < 10; i++) {
    skeletonPosts.push(skeletonPost);
  }

  if (!posts || (!posts.length && !isLoading)) {
    return "No Posts found";
  }

  return (
    <div id="posts" className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-5 tw-gap-4">
      {!!posts.length && posts.map((post, i) => <Post key={i} post={post} />)}
      {!posts.length && skeletonPosts.map((p, i) => <SkeletonPost key={i} />)}
    </div>
  );
}
