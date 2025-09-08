import React from "react";

interface ApproveStudentDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onConfirm: () => void;
  type: "Scholarship" | "Assistantship"; 
  action: "approve" | "reject";
}

const ApproveStudentDialog: React.FC<ApproveStudentDialogProps> = ({ dialogRef, onConfirm, type, action }) => {
  const isApprove = action === "approve";
  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-6 shadow-xl backdrop:bg-black/50 focus:outline-none bg-white w-full max-w-md font-nunito"
    >
      <h2 className="text-xl font-bold mb-4">{isApprove ? "Approve" : "Reject"} {type}</h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to {isApprove ? "approve" : "reject"} this {type.toLowerCase()}? 
        This action cannot be undone.
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
          className={`px-4 py-2 text-sm font-medium text-white rounded focus:outline-none ${
            isApprove ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={() => {
            onConfirm();
            dialogRef.current?.close();
          }}
        >
          {isApprove ? "Approve" : "Reject"}
        </button>
      </div>
    </dialog>
  );
};

export default ApproveStudentDialog;
