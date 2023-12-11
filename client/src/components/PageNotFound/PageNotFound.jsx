import { Link } from "react-router-dom";
export default function PageNotFound() {
  return (
    <div className=" flex flex-col w-full h-full pt-32 items-center">
      <span className="text-red-600 text-5xl mb-4">404</span>
      <span className="text-3xl font-bold mb-8">Page Not Found</span>
      <span>
        The Page you are looking for does not exist. Go to{" "}
        <Link className="text-[#33A9D4]" to="/">
          Home Page
        </Link>
      </span>
    </div>
  );
}
