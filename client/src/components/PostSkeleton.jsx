export default function Post() {
  return (
    <article>
      <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-rounded-md tw-overflow-hidden">
        {/* Image */}
        <div className="tw-min-h-[214px] tw-bg-gray-300"></div>
        {/* Title */}
        <div className="tw-animate-pulse tw-p-4 tw-border tw-grow">
          <div className="tw-animate-pulse tw-min-w-10 tw-w-40 tw-min-h-4 tw-bg-gray-300 tw-mt-1"></div>
          <div className="tw-animate-pulse tw-min-w-20 y tw-min-h-20 tw-bg-gray-300 tw-mt-2"></div>
          <div className="tw-animate-pulse tw-min-w-10 tw-min-h-8 tw-bg-gray-300 tw-mt-3"></div>
        </div>
      </div>
    </article>
  );
}
