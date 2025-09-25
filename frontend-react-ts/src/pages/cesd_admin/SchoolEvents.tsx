import { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  getMyPendingApprovals,
  approveEvent,
  getMyApprovalHistory,
} from "../../services/event";
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
import CalendarDialog from "../../components/ui/CalendarDialog";

interface Approval {
  id: number;
  status: string;
  role: string;
  remarks: string | null;
  approved_at?: string | null;
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
    approvals?: {
      id: number;
      role: string;
      status: string;
      remarks: string | null;
      approved_at: string | null;
      approver?: {
        id: number;
        name?: string;
        email?: string;
        login_id?: string;
      };
    }[];
  };
}

const SchoolEvents = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Approval[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
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
      console.log(res);
    } catch (err) {
      console.error("Error fetching pending approvals:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchApprovalHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await getMyApprovalHistory();
      setHistory(res);
    } catch (err) {
      console.error("Error fetching approval history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
    fetchApprovalHistory();
  }, []);

  // Function to check if user can approve based on hierarchy
  const canUserApprove = (approval: Approval) => {
    if (!approval.event.approvals) return true;

    const approvals = approval.event.approvals.sort((a, b) => a.id - b.id);
    const currentApprovalIndex = approvals.findIndex(
      (a) => a.id === approval.id
    );

    // Check if all previous approvals are completed
    for (let i = 0; i < currentApprovalIndex; i++) {
      if (approvals[i].status !== "approved") {
        return false;
      }
    }

    return true;
  };

  // Enhanced error handling function
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
      await fetchApprovalHistory();
      setCurrentApproval(null);
      setRemarks("");
    } catch (err: any) {
      console.error(`Error updating approval ${approval.id}:`, err);

      // Handle different types of errors
      if (err.response?.data?.message) {
        // Display the specific error message from the backend
        alert(err.response.data.message);
      } else if (err.response?.status === 403) {
        // Generic 403 error
        alert("You are not authorized to perform this action.");
      } else if (err.response?.status === 404) {
        // 404 error
        alert("Approval record not found.");
      } else if (err.response?.status === 500) {
        // Server error
        alert("Server error occurred. Please try again later.");
      } else {
        // Generic error
        alert(
          "An error occurred while processing the approval. Please try again."
        );
      }
    } finally {
      setSubmitting(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen font-nunito overflow-x-hidden">
      <Header title="School Events" />

      <div className="px-6 py-3 flex flex-col gap-3 justify-between items-start h-[calc(100vh-60px)] overflow-hidden">
        {loading ? (
          <div className="bg-white shadow-md rounded h-1/2 p-6 flex flex-col w-full max-w-full overflow-hidden">
            <p className="font-semibold mb-3">Loading.</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="bg-white shadow-md rounded h-1/2 p-6 flex flex-col w-full max-w-full overflow-hidden">
            <p className="font-semibold mb-3">No pending approvals.</p>
          </div>
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
        <div className="bg-white shadow-md rounded h-1/2 p-6 flex flex-col w-full max-w-full overflow-hidden">
          <div className="mb-3 flex justify-between">
            <h1 className="font-semibold ">Approval History</h1>
            <CalendarDialog />
          </div>
          {loadingHistory ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>No approval history.</p>
          ) : (
            <DraggableCarousel>
              {history.map((approval) => {
                const event = approval.event;
                return (
                  <div
                    key={approval.id}
                    className="card w-80 h-56 flex-shrink-0 bg-gray-50 rounded shadow-md border-gray-200 p-4 flex flex-col"
                  >
                    {/* Event Title */}
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold text-base text-gray-800 line-clamp-1">
                        {event.name}
                      </h2>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          approval.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : approval.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : approval.status === "revision"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {approval.status}
                      </span>
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
                    </div>

                    {/* Remarks + Date */}
                    {approval.remarks && (
                      <p className="mt-1 text-xs text-gray-600 italic">
                        "{approval.remarks}"
                      </p>
                    )}
                    {approval.approved_at && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatDateTime(approval.approved_at)}
                      </p>
                    )}
                  </div>
                );
              })}
            </DraggableCarousel>
          )}
        </div>
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
          <div className="bg-white rounded shadow-lg w-full max-w-xl p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <MessageCircle size={20} /> Manage Approval
            </h2>

            {/* ✅ Approval Timeline */}
            {currentApproval.event.approvals &&
              currentApproval.event.approvals.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Approvals</h3>
                  <ul className="divide-y text-sm">
                    {currentApproval.event.approvals.map((a) => (
                      <li key={a.id} className="py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="capitalize font-medium">
                              {a.role}
                            </span>
                            {a.approver && (
                              <span className="ml-2 text-gray-600 text-xs">
                                –{" "}
                                {a.approver.name ||
                                  a.approver.email ||
                                  a.approver.login_id}
                              </span>
                            )}
                          </div>
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

            {/* Show warning message if user cannot approve */}
            {currentApproval && !canUserApprove(currentApproval) && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ You cannot approve this event yet. Previous approvers in the
                hierarchy must approve first.
              </div>
            )}

            {/* Remarks box */}
            <textarea
              className="w-full border rounded p-2 text-sm focus:ring focus:ring-indigo-200"
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Write your remarks here..."
            ></textarea>

            {/* Action buttons */}
            <div className="mt-4 flex h-10 gap-1 justify-between">
              <div className="flex gap-1">
                {/* Approve */}
                <button
                  className="px-4 py-2 flex justify-center items-center gap-1 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  disabled={
                    submitting === currentApproval.id ||
                    !canUserApprove(currentApproval)
                  }
                  onClick={() =>
                    handleApprovalClick(currentApproval, "approved")
                  }
                  title={
                    !canUserApprove(currentApproval)
                      ? "Previous approvers must approve first"
                      : ""
                  }
                >
                  <Check size={14} /> Approve
                </button>

                {/* Reject */}
                <button
                  className="px-4 py-2 flex justify-center items-center gap-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  disabled={
                    submitting === currentApproval.id ||
                    !canUserApprove(currentApproval)
                  }
                  onClick={() =>
                    handleApprovalClick(currentApproval, "rejected")
                  }
                  title={
                    !canUserApprove(currentApproval)
                      ? "Previous approvers must approve first"
                      : ""
                  }
                >
                  <X size={14} /> Reject
                </button>

                {/* Revision */}
                <button
                  className="px-4 py-2 flex justify-center items-center gap-1 text-sm rounded bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
                  disabled={
                    submitting === currentApproval.id ||
                    !canUserApprove(currentApproval)
                  }
                  onClick={() =>
                    handleApprovalClick(currentApproval, "revision")
                  }
                  title={
                    !canUserApprove(currentApproval)
                      ? "Previous approvers must approve first"
                      : ""
                  }
                >
                  <RefreshCw size={14} /> Revision
                </button>
              </div>

              {/* Cancel */}
              <button
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
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
