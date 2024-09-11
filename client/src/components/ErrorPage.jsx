import { useSelector } from "react-redux";
import { AUTH_ERROR } from "../constants/actionTypes";

export default function ErrorPage() {
  const error = useSelector((state) => state.error);
  let errorTitle = null;
  if (error?.statusCode === 500 || error?.error?.response?.status === 500) {
    errorTitle = "Internal Server Error";
  } else if (error.error?.response?.statusText) {
    errorTitle = error.error.response.statusText;
  } else {
    errorTitle = (
      <>
        Oops!! <br /> Something went wrong
      </>
    );
  }
  // if there is no error or error type is Auth Error return null
  if (!error.error || error.type === AUTH_ERROR) return null;
  return (
    <div
      className="tw-fixed  tw-w-[100vw] tw-h-[100vh] tw-z-[99999] tw-m-0 tw-bg-fixed tw-overflow-hidden"
      style={{
        top: "0px",
        backgroundImage:
          "url('https://assets.codepen.io/1538474/star.svg'), linear-gradient(to bottom, #05007A, #4D007D)",
      }}
    >
      <div className="mars"></div>
      <div className="tw-mt-72 tw-flex tw-items-center tw-flex-col">
        <p className="error title tw-mb-8">{errorTitle}</p>
        <div className="subtitle md:tw-text-lg">
          {error.error?.response?.data?.error && <p className="tw-mb-4">{error.error.response.data.error}</p>}
          <p>{error.message || "An unexpected error has ocurred."}</p>
        </div>
        <div className="tw-flex tw-justify-center">
          <a className="btn-back" href="/">
            Back to Home page
          </a>
        </div>
      </div>
      <img src="https://assets.codepen.io/1538474/astronaut.svg" className="astronaut" />
      <img src="https://assets.codepen.io/1538474/spaceship.svg" className="spaceship" />
    </div>
  );
}
