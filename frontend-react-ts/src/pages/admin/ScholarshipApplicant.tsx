// ScholarshipApplicant.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getScholarshipApplications,
  approveScholarshipApplicant,
  rejectScholarshipApplicant,
} from "../../services/scholarship";
import Header from "../../components/Header";
import { FileUser } from "lucide-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import ApproveStudentDialog from "../../components/ui/ApproveStudentDialog";
import PdfPreviewLink from "../../components/ui/PdfPreviewLink";
import PdfPreviewDialog from "../../components/ui/PdfPRviewDialog";

const ScholarshipApplicant = () => {
  dayjs.extend(advancedFormat);
  dayjs.extend(utc);

  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [scholarshipName, setScholarshipName] = useState<string>("");
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
      const data = await getScholarshipApplications(Number(id));
      console.log("API response:", data);
      setScholarshipName(data.scholarship_name || "Scholarship");
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

  const handleApproveScholarship = async (id: number) => {
    try {
      await approveScholarshipApplicant(id);
      await fetchData();
      console.log("Scholarship approved!");
    } catch (err) {
      console.error("Failed to approve:", err);
    }
  };

  const handleRejectScholarship = async (id: number) => {
    try {
      await rejectScholarshipApplicant(id);
      await fetchData();
      console.log("Scholarship rejected");
    } catch (err) {
      console.error("Failed to reject:", err);
    }
  };

  return (
    <div className="bg-bg w-full font-nunito">
      <Header title={scholarshipName || "Scholarship"} />
      <div className="bg-white text-black rounded mx-6 my-6 shadow-md h-[83vh] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileUser className="mb-1 w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Scholarship Applicants
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
                  <th className="px-4 py-2 font-medium">File</th>
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
                      <PdfPreviewLink
                        path={applicant.pdf_url}
                        name={applicant.original_name}
                        onPreview={(url) => setPreviewUrl(url)}
                      />
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
                          openDialog(applicant.id!, "Scholarship", "approve")
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
                          openDialog(applicant.id!, "Scholarship", "reject")
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
          if (dialogConfig.type === "Scholarship") {
            dialogConfig.action === "approve"
              ? handleApproveScholarship(dialogConfig.id!)
              : handleRejectScholarship(dialogConfig.id!);
          }
          // Later: you can add Assistantship handlers here if needed
        }}
        type={dialogConfig?.type ?? "Scholarship"}
        action={dialogConfig?.action ?? "approve"}
      />

      <PdfPreviewDialog
        fileUrl={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
};

export default ScholarshipApplicant;
