import React, { useState } from "react";

interface AssistantshipDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  onCancel: () => void;
  onSubmit: (formData: { name: string; description: string; file: File }) => void | Promise<void>;
}

const AssistantshipDialog: React.FC<AssistantshipDialogProps> = ({
  dialogRef,
  selectedFile,
  handleFileChange,
  handleRemoveFile,
  onCancel,
  onSubmit,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameInput = (e.currentTarget.elements.namedItem("assistantshipName") as HTMLInputElement)
      ?.value;
    const descriptionInput = (e.currentTarget.elements.namedItem("assistantshipDescription") as HTMLTextAreaElement)
      ?.value;

    if (nameInput && descriptionInput && selectedFile) {
      try {
        setSubmitting(true);
        await onSubmit({ name: nameInput, description: descriptionInput, file: selectedFile });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-6 shadow-xl backdrop:bg-black/50 focus:outline-none bg-white w-full max-w-md font-nunito"
    >
      <h2 className="text-xl font-bold mb-4">Add Assistantship</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Assistantship Name */}
        <div className="space-y-2">
          <label
            htmlFor="assistantshipName"
            className="block text-sm font-medium text-gray-700"
          >
            Assistantship Name
          </label>
          <input
            type="text"
            id="assistantshipName"
            name="assistantshipName"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
            disabled={submitting}
          />
        </div>

        {/* Assistantship Description */}
        <div className="space-y-2">
          <label
            htmlFor="assistantshipDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="assistantshipDescription"
            name="assistantshipDescription"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green resize-none"
            required
            disabled={submitting}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label
            htmlFor="applicationForm"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Application Form
          </label>

          <input
            type="file"
            id="applicationForm"
            name="applicationForm"
            accept=".pdf"
            onChange={handleFileChange}
            className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green hover:file:bg-green-100 ${
              selectedFile ? "hidden" : ""
            }`}
            required={!selectedFile}
            disabled={submitting}
          />

          {selectedFile && (
            <div className="flex items-center justify-between p-2 border border-gray-300 rounded bg-gray-50">
              <span className="truncate text-sm">{selectedFile.name}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove file"
                disabled={submitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green rounded hover:bg-green-700 focus:outline-none"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {submitting && (
        <div className="flex justify-center mt-4">
          <span className="loading loading-spinner loading-md text-green"></span>
        </div>
      )}
    </dialog>
  );
};

export default AssistantshipDialog;
