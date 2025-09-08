  import React, { useState } from "react";

  interface StudentApplyDialogProps {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    selectedFile: File | null;
    selectedFiles?: File[];   // 👈 NEW (for multiple mode)
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFile: (index?: number) => void; // 👈 now supports removing from array
    onCancel: () => void;
    onSubmit: (files: File | File[]) => void | Promise<void>;
    title?: string;
    fileLabel?: string;
    multiple?: boolean; // 👈 NEW
  }

  const StudentApplyDialog: React.FC<StudentApplyDialogProps> = ({
    dialogRef,
    selectedFile,
    selectedFiles = [],
    handleFileChange,
    handleRemoveFile,
    onCancel,
    onSubmit,
    title = "Apply",
    fileLabel = "Upload PDF File",
    multiple = false, // default single file
  }) => {
    const [submitting, setSubmitting] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        setSubmitting(true);
        if (multiple) {
          if (selectedFiles.length > 0) await onSubmit(selectedFiles);
        } else {
          if (selectedFile) await onSubmit(selectedFile);
        }
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-6 shadow-xl backdrop:bg-black/50 focus:outline-none bg-white w-full max-w-md font-nunito"
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700">
              {fileLabel}
            </label>

            <input
              type="file"
              id="pdfFile"
              name="pdfFile"
              accept=".pdf"
              multiple={multiple} // 👈 allow multiple
              onChange={handleFileChange}
              className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green hover:file:bg-green-100`}
              required={!multiple ? !selectedFile : selectedFiles.length === 0}
              disabled={submitting}
            />

            {/* Single file mode */}
            {!multiple && selectedFile && (
              <div className="flex items-center justify-between p-2 border border-gray-300 rounded bg-gray-50">
                <span className="truncate text-sm">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile()}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label="Remove file"
                  disabled={submitting}
                >
                  ✕
                </button>
              </div>
            )}

            {multiple && selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border border-gray-300 rounded bg-gray-50"
                  >
                    <span className="truncate text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                      aria-label="Remove file"
                      disabled={submitting}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green rounded hover:bg-green-700"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </dialog>
    );
  };

  export default StudentApplyDialog;
