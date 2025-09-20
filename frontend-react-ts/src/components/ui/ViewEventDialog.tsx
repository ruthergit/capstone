import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import type { Event } from "../../services/event";
import { useState, useEffect } from "react";
import PdfPreviewDialog from "./PdfPRviewDialog";
import PdfPreviewLink from "./PdfPreviewLink";
import EditEventDialog from "./EditEventDialog";

interface Props {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: (updatedEvent: Event) => void;
}

const ViewEventDialog = ({ event, isOpen, onClose, onEventUpdated }: Props) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // ✅ Add local state to ensure we have the latest event data
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const backendUrl = "http://127.0.0.1:8000";

  // ✅ Update local state when event prop changes
  useEffect(() => {
    if (event) {
      setCurrentEvent(event);
    }
  }, [event]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    // ✅ Update both local state and notify parent
    setCurrentEvent(updatedEvent);
    onEventUpdated(updatedEvent);
    setIsEditDialogOpen(false);
    // Don't close the view dialog immediately - let user see the updated data
  };

  // ✅ Use currentEvent instead of event prop directly
  if (!currentEvent) return null;

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="relative z-50"
        as="div"
        aria-labelledby="event-title"
        aria-describedby="event-description"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 id="event-title" className="text-lg font-semibold">
                {currentEvent.name}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p id="event-description" className="text-gray-600">
              {currentEvent.short_description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Type:</span> {currentEvent.type}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {currentEvent.location || "—"}
              </p>
              <p>
                <span className="font-medium">Proposed:</span>{" "}
                {formatDate(currentEvent.proposed_date)}
              </p>
              {currentEvent.optional_date && (
                <p>
                  <span className="font-medium">Optional:</span>{" "}
                  {formatDate(currentEvent.optional_date)}
                </p>
              )}
              {currentEvent.final_date && (
                <p>
                  <span className="font-medium">Final:</span>{" "}
                  {formatDate(currentEvent.final_date)}
                </p>
              )}
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`${
                    currentEvent.status === "approved"
                      ? "text-green-600"
                      : currentEvent.status === "pending"
                      ? "text-yellow-600"
                      : currentEvent.status === "rejected"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {currentEvent.status}
                </span>
              </p>
            </div>

            {currentEvent.approvals && currentEvent.approvals.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Approvals</h3>
                <ul className="divide-y text-sm">
                  {currentEvent.approvals.map((a) => (
                    <li key={a.id} className="py-2">
                      <div className="flex justify-between items-start">
                        <span className="capitalize font-medium">
                          {a.role}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            a.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : a.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : a.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      {a.remarks && (
                        <p className="mt-1 text-gray-600 text-sm italic">
                          "{a.remarks}"
                        </p>
                      )}
                      {a.approved_at && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          {formatDateTime(a.approved_at)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentEvent.files && currentEvent.files.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Files</h3>
                <ul className="list-disc list-inside text-sm text-blue-600">
                  {currentEvent.files.map((f) => (
                    <li key={f.id}>
                      <PdfPreviewLink
                        path={`${backendUrl}/preview-pdf/${f.file_path}`}
                        name={f.original_name}
                        onPreview={(url) => setSelectedFileUrl(url)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentEvent.status === "revision" && (
              <div className="pt-4">
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Edit & Resubmit
                </button>
              </div>
            )}
          </div>
        </div>
        
        <PdfPreviewDialog
          fileUrl={selectedFileUrl}
          onClose={() => setSelectedFileUrl(null)}
        />
      </Dialog>

      <EditEventDialog
        event={currentEvent}
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        onUpdated={handleEventUpdated}
      />
    </>
  );
};

export default ViewEventDialog;