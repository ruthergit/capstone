import { GraduationCap, Briefcase } from "lucide-react";
import Header from "../../components/Header";
import { useState, useEffect, useRef } from "react";
import { // ✅ Services (API functions + types)
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
  const userId = useUserStore((state) => state.user?.id); // Logged-in user ID

  /*  Track Applied Scholarships/Assistantships ------------------- */
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState<Set<number>>(new Set());
  const [appliedAssistantshipIds, setAppliedAssistantshipIds] = useState<Set<number>>(new Set());

  // Load user scholarship applications
  useEffect(() => {
    if (!userId) return;
    getUserScholarshipApplications(userId)
      .then((apps) => {
        setAppliedScholarshipIds(new Set(apps.map((a: any) => a.scholarship_id)));
      })
      .catch(console.error);
  }, [userId]);

  // Load user assistantship applications
  useEffect(() => {
    if (!userId) return;
    getUserAssistantshipApplications(userId)
      .then((apps) => {
        setAppliedAssistantshipIds(new Set(apps.map((a: any) => a.assistantship_id)));
      })
      .catch(console.error);
  }, [userId]);

  // Check if user already applied
  const hasAppliedScholarship = (id: number) => appliedScholarshipIds.has(id);
  const hasAppliedAssistantship = (id: number) => appliedAssistantshipIds.has(id);

  /*  Page State  */
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // PDF preview dialog
  const [isScholarshipActive, setScholarship] = useState(true); // Toggle scholarship page
  const [isAssistantshipActive, setAssistantship] = useState(true); // Toggle assistantship page

  const toggleScholarship = () => setScholarship(!isScholarshipActive);
  const toggleAssistantship = () => setAssistantship(!isAssistantshipActive);

  /*  Fetched Data  */
  const [scholarships, setScholarshipList] = useState<Scholarship[]>([]);
  const [assistantships, setAssistantshipList] = useState<Assistantship[]>([]);

  // Fetch scholarships
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const data = await getScholarship();
        setScholarshipList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScholarships();
  }, []);

  // Fetch assistantships
  useEffect(() => {
    const fetchAssistantships = async () => {
      try {
        const data = await getAssistantship();
        setAssistantshipList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssistantships();
  }, []);

  /*  Application Dialog */
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const id = useIdStore((state) => state.id); // ID of selected scholarship/assistantship
  const setId = useIdStore((state) => state.setId);

  // Open dialog when ID is set
  const openDialog = () => {
    dialogRef.current?.showModal();
    console.log("Selected ID:", id);
  };

  useEffect(() => {
    if (isScholarshipActive) {
      setId(null); // reset when switching
    }
    if (id !== null) {
      openDialog();
    }
  }, [id]);

  // File input handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = () => setSelectedFile(null);
  const handleCancel = () => {
    dialogRef.current?.close();
    setSelectedFile(null);
  };

  // Submit scholarship application
  const handleSubmit = async (file: File) => {
    try {
      await applyScholarship(id!, file);
      dialogRef.current?.close();
      setSelectedFile(null);
    } catch (err) {
      console.error("Failed to apply scholarship:", err);
    }
  };

  /* Render */
  return (
    <div className="bg-bg w-full">
      <Header title="Student Support" />

      {isScholarshipActive && isAssistantshipActive && (
        <div>
          <div className="text-center mt-6">
            <p className="text-gray-700 text-xl font-semibold">
              Please select a category below to get started.
            </p>
          </div>
          <div className="mx-6 my-6 flex h-2/7 gap-4 justify-center items-center">
            {/* Scholarship Choice */}
            <div
              onClick={toggleScholarship}
              className="w-full flex flex-col shadow-md items-center justify-center p-8 rounded bg-white hover:bg-blue-100 cursor-pointer transition"
            >
              <GraduationCap className="w-12 h-12 text-blue-700 mb-2" />
              <h2 className="text-xl font-semibold text-blue-800">Scholarship</h2>
            </div>

            {/* Assistantship Choice */}
            <div
              onClick={toggleAssistantship}
              className="w-full flex flex-col shadow-md items-center justify-center p-8 rounded bg-white hover:bg-green-100 cursor-pointer transition"
            >
              <Briefcase className="w-12 h-12 text-green-700 mb-2" />
              <h2 className="text-xl font-semibold text-green-800">Assistantship</h2>
            </div>
          </div>
        </div>
      )}

      {!isScholarshipActive && (
        <div className="bg-white font-nunito text-black rounded mx-6 my-6 shadow-md h-[83vh] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-7" />
              <h2 className="text-lg font-semibold text-gray-800">
                Available Scholarships
              </h2>
            </div>
          </div>

          {/* Table */}
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
                    {/* Title */}
                    <td className="px-4 py-3">{scholarship.name}</td>

                    {/* PDF Link */}
                    <td className="px-4 py-3">
                      <PdfPreviewLink
                        path={scholarship.pdf_url}
                        name={scholarship.name}
                        onPreview={(url) => setPreviewUrl(url)}
                      />
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-3">
                      <button
                        key={scholarship.id}
                        disabled={hasAppliedScholarship(scholarship.id!)}
                        onClick={() => {
                          setId(scholarship.id!);
                        }}
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

      {/*  Assistantship List */}
      {!isAssistantshipActive && (
        <div className="bg-white font-nunito text-black rounded mx-6 my-6 shadow-md h-[83vh] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-7" />
              <h2 className="text-lg font-semibold text-gray-800">
                Available Assistantships
              </h2>
            </div>
          </div>

          {/* Table */}
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
                    {/* Title */}
                    <td className="px-4 py-3">{assistantship.name}</td>

                    {/* Description */}
                    <td className="px-4 py-3">{assistantship.description}</td>

                    {/* PDF Link */}
                    <td className="px-4 py-3">
                      <PdfPreviewLink
                        path={assistantship.pdf_url}
                        name={assistantship.name}
                        onPreview={(url) => setPreviewUrl(url)}
                      />
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-3">
                      <button
                        key={assistantship.id}
                        disabled={hasAppliedAssistantship(assistantship.id!)}
                        // TODO: hook up assistantship application
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

      {/*  Reusable Dialogs */}
      <StudentApplyDialog
        dialogRef={dialogRef}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      <PdfPreviewDialog fileUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  );
};

export default StudentSupport;
