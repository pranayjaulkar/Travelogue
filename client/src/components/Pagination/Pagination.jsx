import { Pagination, PaginationItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../actions/posts";

export default function Paginate({ page }) {
  const dispatch = useDispatch();
  const { noOfPages } = useSelector((state) => state.posts);
  const navigate = useNavigate();

  useEffect(() => {
    if (page) {
      dispatch(getPosts(page, navigate));
    }
  }, [dispatch, navigate, page]);

  return (
    <Pagination
      count={noOfPages}
      size="small"
      page={Number(page)}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          className="mx-2"
          component={Link}
          to={`/posts${item.page === 1 ? "" : `?page=${item.page}`}`}
          {...item}
        />
      )}
    />
  );
}
