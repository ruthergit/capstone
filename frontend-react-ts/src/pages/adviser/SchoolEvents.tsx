import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { getMyPendingApprovals, approveEvent } from "../../services/event";
import {
  Check,
  X,
  RefreshCw,
  MessageCircle,
  EllipsisVertical,
  Paperclip,
} from "lucide-react";
import PdfPreviewDialog from "../../components/ui/PdfPRviewDialog";
import PdfPreviewLink from "../../components/ui/PdfPreviewLink";
import DraggableCarousel from "../../components/DraggableCarousel";

interface Approval {
  id: number;
  status: string;
  role: string;
  remarks: string | null;
  event: {
    id: number;
    name: string;
    short_description: string;
    type: string;
    location?: string;
    proposed_date: string;
    optional_date?: string;
    final_date?: string;
    status: string;
    student_org?: { name: string };
    files?: { id: number; file_path: string; original_name: string }[];
  };
}

const SchoolEvents = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [remarks, setRemarks] = useState("");
  const [currentApproval, setCurrentApproval] = useState<Approval | null>(null);

  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null
  );

  const backendUrl = "http://127.0.0.1:8000";

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const res = await getMyPendingApprovals();
      setApprovals(res);
    } catch (err) {
      console.error("Error fetching pending approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApprovalClick = async (
    approval: Approval,
    action: "approved" | "rejected" | "revision"
  ) => {
    try {
      setSubmitting(approval.id);
      await approveEvent(approval.event.id, {
        status: action,
        remarks,
      });
      await fetchPendingApprovals();
      // reset & close modal
      setCurrentApproval(null);
      setRemarks("");
    } catch (err) {
      console.error(`Error updating approval ${approval.id}:`, err);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen font-nunito overflow-x-hidden">
      <Header title="School Events" />

      <div className="px-6 py-3 flex justify-between items-start h-[calc(100vh-60px)] overflow-hidden">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : approvals.length === 0 ? (
          <p className="text-gray-500">No pending approvals.</p>
        ) : (
          <div className="bg-white shadow-md rounded h-1/2 p-6 flex flex-col w-full max-w-full overflow-hidden">
            <h1 className="font-semibold mb-3">Pending Approvals</h1>
            <DraggableCarousel>
              {approvals.map((approval) => {
                const event = approval.event;
                return (
                  <div
                    key={approval.id}
                    className="card w-80 h-56 flex-shrink-0 bg-green-50 rounded shadow-md border-gray-200 p-4 flex flex-col"
                  >
                    {/* Event Title */}
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold text-base text-gray-800 line-clamp-1">
                        {event.name}
                      </h2>
                      <div className="flex">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-indigo-600 hover:text-indigo-600 transition">
                          <Paperclip
                            size={17}
                            onClick={() => setSelectedApproval(approval)}
                          />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-indigo-600 hover:text-indigo-600 transition"
                          onClick={() => setCurrentApproval(approval)}
                        >
                          <EllipsisVertical size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {event.short_description}
                    </p>

                    {/* Event Details */}
                    <div className="text-sm text-gray-900 space-y-1 flex-1">
                      <p>
                        <span className="font-medium">Org:</span>{" "}
                        {event.student_org?.name || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span> {event.type}
                      </p>
                      {event.location && (
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {event.location}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Proposed:</span>{" "}
                        {event.proposed_date}
                      </p>
                      {event.optional_date && (
                        <p>
                          <span className="font-medium">Optional:</span>{" "}
                          {event.optional_date}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </DraggableCarousel>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <div className="w-full flex justify-between">
              <h1 className="font-semibold">Files</h1>
              <X
                className="w-4 cursor-pointer"
                onClick={() => setSelectedApproval(null)}
              />
            </div>

            {selectedApproval.event.files &&
              selectedApproval.event.files.length > 0 && (
                <div className="flex flex-wrap gap-1 my-2">
                  {selectedApproval.event.files.map((file) => (
                    <PdfPreviewLink
                      key={file.id}
                      path={`${backendUrl}/storage/${file.file_path}`}
                      name={file.original_name}
                      onPreview={(url) => setPreviewUrl(url)}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {currentApproval && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <MessageCircle size={20} /> Manage Approval
            </h2>

            <textarea
              className="w-full border rounded p-2 text-sm focus:ring focus:ring-indigo-200"
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Write your remarks here..."
            ></textarea>

            <div className="mt-4 flex h-10 justify-end gap-1">
              <button
                className="px-4 py-2 flex justify-center items-center gap-1 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={submitting === currentApproval.id}
                onClick={() =>
                  handleApprovalClick(currentApproval, "approved")
                }
              >
                <Check size={14} /> Approve
              </button>

              <button
                className="px-4 py-2 flex justify-center items-center gap-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={submitting === currentApproval.id}
                onClick={() =>
                  handleApprovalClick(currentApproval, "rejected")
                }
              >
                <X size={14} /> Reject
              </button>

              <button
                className="px-4 py-2 flex justify-center items-center gap-1 text-sm rounded bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
                disabled={submitting === currentApproval.id}
                onClick={() =>
                  handleApprovalClick(currentApproval, "revision")
                }
              >
                <RefreshCw size={14} /> Revision
              </button>

              <button
                className="px-4 py-2 ml-4.5 text-sm rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setCurrentApproval(null);
                  setRemarks("");
                }}
              >
                Cancel
              </button>

              
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Dialog */}
      <PdfPreviewDialog
        fileUrl={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
};

export default SchoolEvents;
