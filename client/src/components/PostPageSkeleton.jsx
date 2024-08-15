export default function PostPageSkeleton() {
  return (
    <div className="tw-flex tw-mt-8 tw-mx-auto tw-max-w-screen-2xl">
      <div className="tw-flex tw-flex-col tw-w-1/2 tw-space-y-2 tw-pr-6">
        <div className="tw-space-y-1">
          <div className="tw-animate-pulse tw-w-60 tw-min-w-32 tw-h-12 tw-min-h-12 tw-bg-gray-300"></div>
          <div className="tw-animate-pulse tw-w-24 tw-min-w-16 tw-h-6 tw-min-h-6 tw-bg-gray-300"></div>
        </div>
        <div className="tw-animate-pulse  tw-w-52 tw-min-w-16  tw-h-5 tw-bg-gray-300"></div>
        <div className=" tw-animate-pulse tw-w-24 tw-min-w-80 tw-h-6 tw-min-h-6 tw-bg-gray-300"></div>
        <div className="tw-animate-pulse tw-min-w-16 tw-w-full  tw-h-[400px] tw-bg-gray-300"></div>
        <div
          style={{ marginTop: "2.5rem" }}
          className="tw-animate-pulse tw-min-w-16 tw-w-full tw-h-[200px] tw-bg-gray-300"
        ></div>
      </div>
      <div className="tw-flex tw-flex-col tw-w-1/2 tw-space-y-10">
        <div className="tw-animate-pulse tw-min-w-16 tw-w-full  tw-h-[500px] tw-bg-gray-300"></div>
        <div className="tw-flex tw-space-x-4">
          <div className="tw-animate-pulse tw-min-w-16 tw-w-full  tw-h-[280px] tw-bg-gray-300"></div>
          <div className="tw-animate-pulse tw-min-w-16 tw-w-full  tw-h-[280px] tw-bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
