// AssistantshipApplicant.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getAssistantshipApplications,
  approveAssistantshipApplicant,
  rejectAssistantshipApplicant,
} from "../../services/assistantship";
import Header from "../../components/Header";
import { FileUser } from "lucide-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import ApproveStudentDialog from "../../components/ui/ApproveStudentDialog";
import PdfPreviewLink from "../../components/ui/PdfPreviewLink";
import PdfPreviewDialog from "../../components/ui/PdfPRviewDialog";

const AssistantshipApplicant = () => {
  dayjs.extend(advancedFormat);
  dayjs.extend(utc);

  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [assistantshipName, setAssistantshipName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [dialogConfig, setDialogConfig] = useState<{
    id: number | null;
    type: "Scholarship" | "Assistantship";
    action: "approve" | "reject";
  } | null>(null);

  const openDialog = (
    id: number,
    type: "Scholarship" | "Assistantship",
    action: "approve" | "reject"
  ) => {
    setDialogConfig({ id, type, action });
    dialogRef.current?.showModal();
  };

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getAssistantshipApplications(Number(id));
      console.log("API response:", data);

      setAssistantshipName(data.assistantship_name || "Assistantship");
      setApplications(data.applicants || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleApproveAssistantship = async (id: number) => {
    try {
      await approveAssistantshipApplicant(id);
      await fetchData();
      console.log("Assistantship approved!");
    } catch (err) {
      console.error("Failed to approve:", err);
    }
  };

  const handleRejectAssistantship = async (id: number) => {
    try {
      await rejectAssistantshipApplicant(id);
      await fetchData();
      console.log("Assistantship rejected");
    } catch (err) {
      console.error("Failed to reject:", err);
    }
  };

  return (
    <div className="bg-bg w-full font-nunito">
      <Header title={assistantshipName || "Assistantship"} />

      <div className="bg-white text-black rounded mx-6 my-6 shadow-md h-[83vh] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileUser className="mb-1 w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              {assistantshipName} Applicants
            </h2>
          </div>
        </div>

        <div className="overflow-auto h-[370px] rounded border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading applicants...
            </div>
          ) : applications.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No applicants found.
            </div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Files</th>
                  <th className="px-4 py-2 font-medium">Date & Time</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="pr-2 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((applicant) => (
                  <tr key={applicant.id} className="border-t">
                    <td className="px-4 py-3">{applicant.user_name}</td>
                    <td className="px-4 py-3">{applicant.user_email}</td>
                    <td className="px-4 py-3">
                      {applicant.files?.length ? (
                        applicant.files.map((file: any) => (
                          <PdfPreviewLink
                            key={file.id}
                            path={file.file_url}
                            name={file.original_name}
                            onPreview={(url) => setPreviewUrl(url)}
                          />
                        ))
                      ) : (
                        <span className="text-gray-400">No files</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {dayjs
                        .utc(applicant.created_at)
                        .local()
                        .format("MMMM D, YYYY h:mm A")}
                    </td>
                    <td className="px-4 py-3 capitalize">{applicant.status}</td>
                    <td className="w-40">
                      <button
                        onClick={() =>
                          openDialog(applicant.id!, "Assistantship", "approve")
                        }
                        disabled={applicant.status === "approved"}
                        className={`inline-block px-2 py-1 mr-2 text-xs font-semibold rounded focus:outline-none 
                          ${
                            applicant.status === "pending"
                              ? "text-green-700 bg-green-100 hover:bg-green-200"
                              : "text-gray-500 bg-gray-200 cursor-not-allowed"
                          }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          openDialog(applicant.id!, "Assistantship", "reject")
                        }
                        disabled={
                          applicant.status === "approved" ||
                          applicant.status === "rejected"
                        }
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded focus:outline-none 
                          ${
                            applicant.status === "pending"
                              ? "text-red-500 bg-red-100 hover:bg-red-200"
                              : "text-gray-500 bg-gray-200 cursor-not-allowed"
                          }`}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ApproveStudentDialog
        dialogRef={dialogRef}
        onConfirm={() => {
          if (!dialogConfig) return;
          if (dialogConfig.type === "Assistantship") {
            dialogConfig.action === "approve"
              ? handleApproveAssistantship(dialogConfig.id!)
              : handleRejectAssistantship(dialogConfig.id!);
          }
        }}
        type={dialogConfig?.type ?? "Assistantship"}
        action={dialogConfig?.action ?? "approve"}
      />

      <PdfPreviewDialog
        fileUrl={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
};

export default AssistantshipApplicant;
