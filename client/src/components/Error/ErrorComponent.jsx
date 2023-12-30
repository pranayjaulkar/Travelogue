export default function ErrorComponent({ error }) {
  return (
    <div
      className="fixed  w-[100vw] h-[100vh] z-[99999] m-0 bg-fixed overflow-hidden"
      style={{
        top: "0px",
        backgroundImage:
          "url('https://assets.codepen.io/1538474/star.svg'), linear-gradient(to bottom, #05007A, #4D007D)",
      }}
    >
      <div className="mars"></div>
      {error?.statusCode && error.statusCode === 404 ? (
        <img
          src="https://assets.codepen.io/1538474/404.svg"
          className="logo-404"
        />
      ) : (
        <span>{error.statusCode}</span>
      )}
      <img
        src="https://assets.codepen.io/1538474/meteor.svg"
        className="meteor"
      />
      <p className="error-title mb-4">
        Oh no!! <br /> Something went wrong
      </p>
      <p className="subtitle">{error.message}</p>
      <div className="flex justify-center">
        <a className="btn-back" href="/">
          Back to Home page
        </a>
      </div>
      <img
        src="https://assets.codepen.io/1538474/astronaut.svg"
        className="astronaut"
      />
      <img
        src="https://assets.codepen.io/1538474/spaceship.svg"
        className="spaceship"
      />
    </div>
  );
}
