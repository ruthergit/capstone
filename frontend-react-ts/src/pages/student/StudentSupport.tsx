import { GraduationCap, Briefcase, ArrowLeft } from "lucide-react";
import Header from "../../components/Header";
import { useState, useEffect, useRef } from "react";
// ✅ Services (API functions + types)
import {
  getUserScholarshipApplications,
  getScholarship,
  type Scholarship,
  applyScholarship,
} from "../../services/scholarship";
import {
  getUserAssistantshipApplications,
  getAssistantship,
  type Assistantship,
  applyAssistantship,
} from "../../services/assistantship";
// ✅ UI Components
import PdfPreviewLink from "../../components/ui/PdfPreviewLink";
import StudentApplyDialog from "../../components/ui/StudentApplyDialog";
import PdfPreviewDialog from "../../components/ui/PdfPRviewDialog";
// ✅ State stores
import { useIdStore } from "../../store/ScholarshipId";
import { useUserStore } from "../../store/useUserStore";

const StudentSupport = () => {
  /*  Global User Data ------------------- */
  const userId = useUserStore((state) => state.user?.id);

  /* Track Applications ------------------- */
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState<Set<number>>(new Set());
  const [appliedAssistantshipIds, setAppliedAssistantshipIds] = useState<Set<number>>(new Set());

  // Load user scholarship applications
  useEffect(() => {
    if (!userId) return;
    getUserScholarshipApplications(userId)
      .then((apps) => setAppliedScholarshipIds(new Set(apps.map((a: any) => a.scholarship_id))))
      .catch(console.error);
  }, [userId]);

  // Load user assistantship applications
  useEffect(() => {
    if (!userId) return;
    getUserAssistantshipApplications(userId)
      .then((apps) => setAppliedAssistantshipIds(new Set(apps.map((a: any) => a.assistantship_id))))
      .catch(console.error);
  }, [userId]);

  const hasAppliedScholarship = (id: number) => appliedScholarshipIds.has(id);
  const hasAppliedAssistantship = (id: number) => appliedAssistantshipIds.has(id);

  /* Page State for viewing pdf's */
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Instead of 2 booleans → use 1 active type
  const [activeType, setActiveType] = useState<"scholarship" | "assistantship" | null>(null);

  const showScholarships = () => setActiveType("scholarship");
  const showAssistantships = () => setActiveType("assistantship");
  const goBack = () => setActiveType(null);

  /* Data ------------------- */
  const [scholarships, setScholarshipList] = useState<Scholarship[]>([]);
  const [assistantships, setAssistantshipList] = useState<Assistantship[]>([]);

  useEffect(() => {
    getScholarship().then(setScholarshipList).catch(console.error);
    getAssistantship().then(setAssistantshipList).catch(console.error);
  }, []);

  /* Application Dialog ------------------- */
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const id = useIdStore((state) => state.id);
  const setId = useIdStore((state) => state.setId);

  const openDialog = () => dialogRef.current?.showModal();

  useEffect(() => {
    if (id !== null) {
      openDialog();
    }
  }, [id]);

  // File input handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (activeType === "scholarship") {
      setSelectedFile(files[0]); // single
    }
    if (activeType === "assistantship") {
      setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index?: number) => {
    if (activeType === "scholarship") {
      setSelectedFile(null);
    }
    if (activeType === "assistantship" && index !== undefined) {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCancel = () => {
    dialogRef.current?.close();
    setSelectedFile(null);
    setSelectedFiles([]);
    setId(null);
  };

  // Submit handler (shared)
  const handleSubmit = async () => {
    try {
      if (activeType === "scholarship" && selectedFile) {
        await applyScholarship(id!, selectedFile);
        dialogRef.current?.close();
        setSelectedFile(null);
      }

      if (activeType === "assistantship" && selectedFiles.length > 0) {
        await applyAssistantship(id!, selectedFiles);
        dialogRef.current?.close();
        setSelectedFiles([]);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  /* Render ------------------- */
  return (
    <div className="bg-bg w-full">
      <Header title="Student Support" />

      {/* Selection Page */}
      {activeType === null && (
        <div>
          <div className="text-center mt-6">
            <p className="text-gray-700 text-xl font-semibold">
              Please select a category below to get started.
            </p>
          </div>
          <div className="mx-6 my-6 flex h-2/7 gap-4 justify-center items-center">
            <div
              onClick={showScholarships}
              className="w-full flex flex-col shadow-md items-center justify-center p-8 rounded bg-white hover:bg-blue-100 cursor-pointer transition"
            >
              <GraduationCap className="w-12 h-12 text-blue-700 mb-2" />
              <h2 className="text-xl font-semibold text-blue-800">Scholarship</h2>
            </div>
            <div
              onClick={showAssistantships}
              className="w-full flex flex-col shadow-md items-center justify-center p-8 rounded bg-white hover:bg-green-100 cursor-pointer transition"
            >
              <Briefcase className="w-12 h-12 text-green-700 mb-2" />
              <h2 className="text-xl font-semibold text-green-800">Assistantship</h2>
            </div>
          </div>
        </div>
      )}

      {/* Scholarship List */}
      {activeType === "scholarship" && (
        <div className="bg-white font-nunito text-black rounded mx-6 my-6 shadow-md h-[83vh] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-7" />
              <h2 className="text-lg font-semibold text-gray-800">
                Available Scholarships
              </h2>
            </div>
            <button onClick={goBack} className="flex items-center gap-1.5 border-gray-300 rounded px-3 py-1 text-sm text-gray-700 shadow-sm hover:bg-green-50 focus:outline-none">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
          </div>
          <div className="overflow-auto h-[370px] rounded border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 font-medium">Scholarship Title</th>
                  <th className="px-4 py-2 font-medium">Application Form</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              {scholarships.map((scholarship) => (
                <tbody key={scholarship.id} className="bg-white text-gray-800">
                  <tr className="border-t">
                    <td className="px-4 py-3">{scholarship.name}</td>
                    <td className="px-4 py-3">
                      <PdfPreviewLink
                        path={scholarship.pdf_url}
                        name={scholarship.name}
                        onPreview={(url) => setPreviewUrl(url)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled={hasAppliedScholarship(scholarship.id!)}
                        onClick={() => setId(scholarship.id!)}
                        className={`inline-block px-2 py-1 text-xs focus:outline-none font-semibold rounded 
                          ${
                            hasAppliedScholarship(scholarship.id!)
                              ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                              : "text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer"
                          }`}
                      >
                        {hasAppliedScholarship(scholarship.id!)
                          ? "Already Applied"
                          : "Apply"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}

      {/* Assistantship List */}
      {activeType === "assistantship" && (
        <div className="bg-white font-nunito text-black rounded mx-6 my-6 shadow-md h-[83vh] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-7" />
              <h2 className="text-lg font-semibold text-gray-800">
                Available Assistantships
              </h2>
            </div>
            <button onClick={goBack} className="flex items-center gap-1.5 border-gray-300 rounded px-3 py-1 text-sm text-gray-700 shadow-sm hover:bg-green-50 focus:outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
          </div>
          <div className="overflow-auto h-[370px] rounded border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 font-medium">Assistantship Title</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                  <th className="px-4 py-2 font-medium">Application Form</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              {assistantships.map((assistantship) => (
                <tbody key={assistantship.id} className="bg-white text-gray-800">
                  <tr className="border-t">
                    <td className="px-4 py-3">{assistantship.name}</td>
                    <td className="px-4 py-3">{assistantship.description}</td>
                    <td className="px-4 py-3">
                      <PdfPreviewLink
                        path={assistantship.pdf_url}
                        name={assistantship.original_name}
                        onPreview={(url) => setPreviewUrl(url)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled={hasAppliedAssistantship(assistantship.id!)}
                        onClick={() => setId(assistantship.id!)}
                        className={`inline-block px-2 py-1 text-xs focus:outline-none font-semibold rounded 
                          ${
                            hasAppliedAssistantship(assistantship.id!)
                              ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                              : "text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer"
                          }`}
                      >
                        {hasAppliedAssistantship(assistantship.id!)
                          ? "Already Applied"
                          : "Apply"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}

      {/* Reusable Dialogs */}
      {activeType === "scholarship" && (
        <StudentApplyDialog
          dialogRef={dialogRef}
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          title="Apply Scholarship"
          fileLabel="Upload Scholarship Application (PDF)"
          multiple={false}
        />
      )}

      {activeType === "assistantship" && (
        <StudentApplyDialog
          dialogRef={dialogRef}
          selectedFile={null}
          selectedFiles={selectedFiles}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          title="Apply Assistantship"
          fileLabel="Upload Assistantship Files (PDFs)"
          multiple={true}
        />
      )}

      <PdfPreviewDialog fileUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  );
};

export default StudentSupport;
