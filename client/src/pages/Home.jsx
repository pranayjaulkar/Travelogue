import Posts from "../components/Posts";
import Pagination from "../components/Pagination";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getPosts } from "../actions/posts";

export default function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tags = query.get("tags")?.split(",") || [];
  const page = query.get("page") || 1;
  const searchQuery = query.get("q");

  useEffect(() => {
    if (page) {
      dispatch(getPosts(page, navigate));
    }
  }, [page]);

  return (
    <div className="tw-flex tw-justify-center tw-items-center">
      <div className="tw-w-[90%] tw-max-w-[90%]">
        <div id="home" className="tw-flex tw-flex-col tw-space-y-6 tw-px-4 tw-py-8">
          {!searchQuery && !tags.length && (
            <div className="tw-flex overflow-scroll tw-justify-center tw-items-center">
              <Pagination page={page} />
            </div>
          )}
          {/* Posts */}
          <Posts />
          {!searchQuery && !tags.length && (
            <div className="tw-flex overflow-scroll tw-justify-center tw-items-center">
              <Pagination page={page} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
