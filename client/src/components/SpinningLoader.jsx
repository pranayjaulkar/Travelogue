export default function SpinningLoader({ size, ...props }) {
  // return (
  //   <div {...props}>
  //     <svg
  //       className="loader"
  //       xmlns="http://www.w3.org/2000/svg"
  //       width={size || 24}
  //       height={size || 24}
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <circle cx="12" cy="12" r="10" />
  //     </svg>
  //   </div>
  // );

  return (
    <div className="loader loader--style2" title="1" {...props}>
      <svg
        version="1.1"
        id="loader-1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width={size || 40}
        height={size || 40}
        viewBox="0 0 50 50"
        style={{ enableBackground: "new 0 0 50 50" }}
      >
        <path
          fill="#000"
          d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
