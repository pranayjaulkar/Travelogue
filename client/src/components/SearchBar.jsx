import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { TextField } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";

export default function SearchBar({ showSearchBar, search, tags, setTags, setSearch }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const query = new URLSearchParams(location.search);
  // const [tags, setTags] = useState(query.get("tags") ? query.get("tags").split(",") : []);
  // const [search, setSearch] = useState(query.get("q") && query.get("q") !== "none" ? query.get("q") : "");

  const handleSearch = () => {
    if (search.trim() || tags.length) {
      navigate(`/posts/search?q=${search.trim() || "none"}&tags=${tags.join(",")}`);
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.keyCode === 13 && search.trim()) {
      navigate(`/posts/search?q=${search.trim() || "none"}&tags=${tags.join(",")}`);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div
      style={{
        transform: showSearchBar && !loading ? "translateY(8vh)" : "",
        transition: "all .5s",
        height: "8vh",
      }}
      className="tw-absolute tw-top-0 tw-w-full tw-h-full tw-space-y-12"
    >
      <div className="tw-flex tw-w-full tw-h-full tw-items-center tw-justify-center tw-space-x-4">
        <TextField
          name="search"
          label="Search Memories"
          value={search || ""}
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={handleEnterKeyPress}
          variant="outlined"
        />
        <MuiChipsInput
          style={{ marginTop: "0px", minWidth: "200px", maxWidth: "400px" }}
          label="Search Using Tags"
          size="small"
          value={tags || ""}
          onChange={(tag) => setTags(tag)}
        />

        <button className="tw-px-6 tw-py-2 tw-rounded-md tw-text-white tw-bg-blue-500" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
