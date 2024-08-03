import { useSelector } from "react-redux";
import ErrorPage  from "../components/ErrorPage";
import { AUTH_ERROR } from "../constants/actionTypes";

export default function ErrorPageProvider() {
  const error = useSelector((state) => state.error);

  if (!error.error || error.type === AUTH_ERROR) return null;
  return (
    <div>
      <ErrorPage error={error} />
    </div>
  );
}
