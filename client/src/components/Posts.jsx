import Post from "./Post";
import { useSelector } from "react-redux";
import SpinningLoader from "./SpinningLoader";

export default function Posts() {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts || (!posts.length && !isLoading)) {
    return "No Posts found";
  }

  return isLoading ? (
    <SpinningLoader className="tw-flex tw-flex-grow tw-items-center tw-justify-center tw-min-h-[74vh]" size={40} />
  ) : (
    <div id="posts" className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-5 tw-gap-4">
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </div>
  );
}
