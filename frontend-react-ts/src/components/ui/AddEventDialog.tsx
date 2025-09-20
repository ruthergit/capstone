import React, { useState } from "react";

interface AddEventDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onCancel?: () => void;
  onSubmit?: (formData: FormData) => void | Promise<void>;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({
  dialogRef,
  onCancel,
  onSubmit,
}) => {
  const [eventType, setEventType] = useState("online");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    files.forEach((file) => formData.append("files[]", file));

    try {
      setSubmitting(true);
      if (onSubmit) await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-6 shadow-xl backdrop:bg-black/50 focus:outline-none bg-white w-full max-w-md font-nunito"
    >
      <h2 className="text-xl font-bold mb-4">Add Event</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Event Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            maxLength={255}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
            Short Description
          </label>
          <textarea
            id="short_description"
            name="short_description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* Type of Event */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type of Event
          </label>
          <select
            id="type"
            name="type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
          >
            <option value="online">Online</option>
            <option value="onsite">Onsite</option>
            <option value="outside">Outside</option>
          </select>
        </div>

        {/* Location if onsite/outside */}
        {(eventType === "onsite" || eventType === "outside") && (
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
              placeholder="Enter location"
            />
          </div>
        )}

        {/* Proposed Date */}
        <div className="space-y-2">
          <label htmlFor="proposed_date" className="block text-sm font-medium text-gray-700">
            Proposed Date
          </label>
          <input
            type="date"
            id="proposed_date"
            name="proposed_date"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* Optional Date */}
        <div className="space-y-2">
          <label htmlFor="optional_date" className="block text-sm font-medium text-gray-700">
            Optional Date
          </label>
          <input
            type="date"
            id="optional_date"
            name="optional_date"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label htmlFor="files" className="block text-sm font-medium text-gray-700">
            Upload Files (JPG, PNG, PDF, Word – max 2MB each)
          </label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={submitting}
            className="w-full text-sm"
          />

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border border-gray-300 rounded bg-gray-50"
                >
                  <span className="truncate text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
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
            onClick={() => {
              dialogRef.current?.close();
              onCancel?.();
            }}
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

export default AddEventDialog;
