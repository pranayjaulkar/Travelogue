export default function PageNotFound() {
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
        <p className="">
          <img src="https://assets.codepen.io/1538474/404.svg" className="logo-404" />
        </p>
        <p className="error title tw-mb-8">Page Not Found</p>
        <p className="subtitle md:tw-text-lg">
          The Page you are looking for does not exists on this website. <br />
          You may have mistyped the address or the page may have moved.
        </p>
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
