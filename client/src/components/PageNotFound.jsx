import { Link } from "react-router-dom";
export default function PageNotFound() {
  return (
    <div className=" tw-flex tw-flex-col tw-w-full tw-h-full tw-pt-32 tw-items-center">
      <span className="tw-text-red-600 tw-text-5xl tw-mb-4">404</span>
      <span className="tw-text-3xl tw-font-bold tw-mb-8">Page Not Found</span>
      <span>
        The Page you are looking for does not exist. Go to
        <Link className="tw-text-blue-500" to="/">
          Home Page
        </Link>
      </span>
    </div>
  );
}
