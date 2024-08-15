import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Paginate({ page }) {
  const { noOfPages } = useSelector((state) => state.posts);

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
