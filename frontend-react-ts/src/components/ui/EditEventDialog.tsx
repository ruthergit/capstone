import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import type { Event } from "../../services/event";
import React, { useState, useEffect } from "react";
import { editEvent } from "../../services/event";

interface Props {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedEvent: Event) => void;
}

const EditEventDialog = ({ event, isOpen, onClose, onUpdated }: Props) => {
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    type: "onsite" as "online" | "onsite" | "outside",
    location: "",
    proposed_date: "",
    optional_date: "",
    removed_files: [] as number[],
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form when dialog opens
  useEffect(() => {
    if (isOpen && event) {
      console.log("Initializing edit form with event:", event);

      const proposedDate = event.proposed_date
        ? event.proposed_date.includes("T")
          ? event.proposed_date.split("T")[0]
          : event.proposed_date
        : "";
      const optionalDate = event.optional_date
        ? event.optional_date.includes("T")
          ? event.optional_date.split("T")[0]
          : event.optional_date
        : "";

      setForm({
        name: event.name || "",
        short_description: event.short_description || "",
        type: (event.type as "online" | "onsite" | "outside") || "onsite",
        location: event.location || "",
        proposed_date: proposedDate,
        optional_date: optionalDate,
        removed_files: [],
      });

      console.log("Form initialized with:", {
        name: event.name,
        short_description: event.short_description,
        type: event.type,
        proposed_date: proposedDate,
      });
    }
  }, [isOpen, event]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setForm({
        name: "",
        short_description: "",
        type: "onsite",
        location: "",
        proposed_date: "",
        optional_date: "",
        removed_files: [],
      });
      setFiles(null);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!event) return;

    console.log("Submitting form:", form);

    // Validation
    if (!form.name.trim()) {
      alert("Event name is required");
      return;
    }
    if (!form.short_description.trim()) {
      alert("Short description is required");
      return;
    }
    if (!form.proposed_date) {
      alert("Proposed date is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Add _method for Laravel to recognize this as PUT
      formData.append("_method", "PUT");

      // Required fields
      formData.append("name", form.name.trim());
      formData.append("short_description", form.short_description.trim());
      formData.append("type", form.type);
      formData.append("location", form.location.trim());
      formData.append("proposed_date", form.proposed_date);

      if (form.optional_date) {
        formData.append("optional_date", form.optional_date);
      }

      // Removed files
      form.removed_files.forEach((id) => {
        formData.append("removed_files[]", id.toString());
      });

      // New files
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("files[]", file);
        });
      }

      const response = await editEvent(formData, event.id);

      console.log("Edit response:", response);

      // ✅ Use the actual response from the server instead of manually constructing
      if (response.event) {
        onUpdated(response.event); // This should contain the updated event with reset approvals
      } else {
        // Fallback: manually construct but ensure approvals are reset
        const updatedEvent = {
          ...event,
          name: form.name.trim(),
          short_description: form.short_description.trim(),
          type: form.type,
          location: form.location.trim(),
          proposed_date: form.proposed_date,
          optional_date: form.optional_date,
          status: "pending",
          // ✅ Reset approvals to reflect backend state
          approvals:
            event.approvals?.map((approval) => ({
              ...approval,
              status: "pending",
              remarks: null,
              approved_at: null,
            })) || [],
        };

        onUpdated(updatedEvent);
      }

      onClose();
    } catch (error: any) {
      console.error("Full error:", error);

      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]: [string, any]) =>
              `${field}: ${messages.join(", ")}`
          )
          .join("\n");
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert("An error occurred while updating the event. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (fileId: number) => {
    setForm((prev) => ({
      ...prev,
      removed_files: [...prev.removed_files, fileId],
    }));
  };

  const handleRestoreFile = (fileId: number) => {
    setForm((prev) => ({
      ...prev,
      removed_files: prev.removed_files.filter((id) => id !== fileId),
    }));
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded shadow-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold">Edit Event</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Event Name"
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Short Description *
              </label>
              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="Short Description"
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Event Type *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
                <option value="outside">Outside</option>
              </select>
            </div>

            {(form.type === "onsite" || form.type === "outside") && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Proposed Date *
              </label>
              <input
                type="date"
                name="proposed_date"
                value={form.proposed_date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Optional Date
              </label>
              <input
                type="date"
                name="optional_date"
                value={form.optional_date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>

            {event.files && event.files.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Current Files</h4>
                <ul className="space-y-2">
                  {event.files.map((f) => {
                    const isRemoved = form.removed_files.includes(f.id);
                    return (
                      <li
                        key={f.id}
                        className={`flex items-center justify-between border p-2 rounded ${
                          isRemoved
                            ? "opacity-50 line-through bg-red-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <span className="text-sm text-gray-700">
                          {f.original_name}
                        </span>
                        {isRemoved ? (
                          <button
                            type="button"
                            onClick={() => handleRestoreFile(f.id)}
                            className="text-green-600 text-xs hover:underline"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(f.id)}
                            className="text-red-600 text-xs hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Add New Files
              </label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={(e) => setFiles(e.target.files)}
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: JPG, JPEG, PNG, PDF, DOC, DOCX (max 2MB each)
              </p>
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Resubmit Event"}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditEventDialog;
