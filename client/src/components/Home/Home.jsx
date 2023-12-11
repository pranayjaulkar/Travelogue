import {
  Grid,
  Paper,
  AppBar,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { Posts, Pagination } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPostsBySearch } from "../../actions/posts";
import "./Home.css";

function useQuery(location) {
  return new URLSearchParams(location.search);
}

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery(location);
  const { isLoading } = useSelector((state) => state.posts);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const page = query.get("page") || 1;
  const searchQuery = query.get("q");
  const handleSearch = () => {
    if (search.trim() || tags.length) {
      dispatch(getPostsBySearch({ query: search.trim(), tags }, navigate));
      navigate(
        `/posts/search?q=${search.trim() || "none"}&tags=${tags.join(",")}`
      );
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.keyCode === 13 && search.trim()) {
      dispatch(getPostsBySearch({ query: search.trim(), tags }, navigate));
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="container">
        <Grid
          className="gridContainer"
          sx={{ width: "100%", margin: "0rem" }}
          container
          spacing={3}
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            sx={{ padding: "0rem !important" }}
            className="firstGridContainer"
          >
            {isLoading ? (
              <Grid className="loading">
                <CircularProgress />
              </Grid>
            ) : (
              <Posts />
            )}
          </Grid>
          {/* Search Section */}
          <Grid item className="secondGridContainer" xs={12} sm={12} md={4}>
            <AppBar
              className="appBarSearch"
              sx={{
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                boxShadow: "none",
              }}
              position="static"
              color="inherit"
            >
              <TextField
                sx={{ marginBottom: "0.5rem " }}
                name="search"
                label="Search Memories"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={handleEnterKeyPress}
                variant="outlined"
              />
              <MuiChipsInput
                sx={{ marginBottom: "0.5rem " }}
                label="Search Using Tags"
                value={tags}
                onChange={(tag) => setTags(tag)}
              />

              <Button
                onClick={handleSearch}
                variant="contained"
                className="searchButton"
                color="primary"
              >
                Search
              </Button>
            </AppBar>
            {!searchQuery && !tags.length && (
              <Paper
                variant="outlined"
                className="flex p-4 mb-4 border justify-center items-center"
              >
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
