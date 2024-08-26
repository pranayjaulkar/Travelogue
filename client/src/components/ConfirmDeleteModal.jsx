export default function ConfirmDeleteModal({ open, setOpen, onConfirm }) {
  if (!open) {
    return null;
  }
  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-fixed tw-top-0 tw-left-0 tw-bottom-0 tw-right-0 tw-z-50 tw-bg-[rgba(0,0,0,0.5)] ">
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-4 tw-rounded-md tw-bg-white">
        <p>Are you sure you want to delete this Post?</p>
        <div className="tw-flex tw-justify-around tw-items-center tw-w-full">
          <button
            onClick={() => {
              setOpen(false);
            }}
            className="tw-px-4 tw-py-1 tw-text-gray-700 hover:tw-bg-gray-200 tw-border tw-rounded-md tw-flex tw-justify-center tw-items-center tw-my-2 tw-mx-4 tw-transition-all tw-duration-300 "
          >
            Cancel
          </button>
          <button
            className="tw-px-4 tw-py-1 tw-text-white tw-bg-red-500 hover:tw-bg-red-700 tw-border tw-rounded-md tw-flex tw-justify-center tw-items-center tw-my-2 tw-mx-4 tw-transition-all tw-duration-300"
            onClick={onConfirm}
            color="error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
