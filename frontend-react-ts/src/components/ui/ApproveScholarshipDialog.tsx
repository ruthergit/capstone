import React from "react";

interface ApproveScholarshipDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onConfirm: () => void;
}

const ApproveScholarshipDialog: React.FC<ApproveScholarshipDialogProps> = ({ dialogRef, onConfirm }) => {
  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-6 shadow-xl backdrop:bg-black/50 focus:outline-none bg-white w-full max-w-md font-nunito"
    >
      <h2 className="text-xl font-bold mb-4">Approve Scholarship</h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to approve this scholarship? This action cannot be undone.
      </p>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
          onClick={() => dialogRef.current?.close()}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-green rounded hover:bg-green-700 focus:outline-none"
          onClick={() => {
            onConfirm();
            dialogRef.current?.close();
          }}
        >
          Approve
        </button>
      </div>
    </dialog>
  );
};

export default ApproveScholarshipDialog;
