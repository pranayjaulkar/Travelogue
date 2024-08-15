import Posts from "../components/Posts";
import Pagination from "../components/Pagination";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function useQuery(location) {
  return new URLSearchParams(location.search);
}

export default function Home() {
  const location = useLocation();
  const query = useQuery(location);
  const [tags] = useState([]);
  const page = query.get("page") || 1;
  const searchQuery = query.get("q");

  return (
    <div className="tw-flex tw-justify-center tw-items-center">
      <div className="tw-w-[90%] tw-max-w-[90%]">
        <div id="home" className="tw-flex tw-flex-col tw-space-y-6 tw-px-4 tw-py-8">
          {!searchQuery && !tags.length && (
            <div className="tw-flex  overflow-scroll tw-justify-center tw-items-center">
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
