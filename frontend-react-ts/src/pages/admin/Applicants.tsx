import { GraduationCap, Briefcase, CirclePlus } from "lucide-react";
import Header from "../../components/Header";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { FileUser } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getScholarshipApplicant, type Applicant, approveScholarship } from "../../services/scholarship";
import { getAssistantshipApplicant, type AssistantshipApplicant } from "../../services/assistantship";
import ApproveScholarshipDialog from "../../components/ui/ApproveScholarshipDialog";

const Applicants = () => {
  const [isScholarshipActive, setScholarship] = useState(true);
  const [isAssistantshipActive, setAssistantship] = useState(true);
  const toggleScholarship = () => setScholarship(!isScholarshipActive);
  const toggleAssistantship = () => setAssistantship(!isAssistantshipActive);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null); // <-- store selected applicant id

  const openDialog = (id: number) => {
    setSelectedId(id); // save the id
    dialogRef.current?.showModal();
  };

  dayjs.extend(advancedFormat);
  dayjs.extend(utc);

  const [applicants, setApplicantList] = useState<Applicant[]>([]);
  const [assistantshipApplicants, setAssistantshipApplicantList] = useState<AssistantshipApplicant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScholarshipApplicant();
        setApplicantList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssistantshipApplicant();
        setAssistantshipApplicantList(data);
      } catch (err) {
        console.error(err)
      }
    }
    fetchData();
  },[]);

  const handleApproveScholarship = async (id: number) => {
    try {
      await approveScholarship(id);
      console.log("Scholarship approved!");
      const updatedList = await getScholarshipApplicant();
      setApplicantList(updatedList);
    } catch (err) {
      console.error("Failed to approve:", err);
    }
  };

  return (
    <div className="bg-bg w-full">
      <Header title="Applicants" />

      {isScholarshipActive && isAssistantshipActive && (
        <div>
          <div className="text-center mt-6">
            <p className="text-gray-700 text-xl font-semibold">
              Please select a category below to get started.
            </p>
          </div>

          <div className="mx-6 my-6 flex h-2/7 gap-4 justify-center items-center">
            <div
              onClick={toggleScholarship}
              className="w-full flex flex-col shadow-md items-center justify-center p-8 rounded bg-white hover:bg-blue-100 cursor-pointer transition"
            >
              <GraduationCap className="w-12 h-12 text-blue-700 mb-2" />
              <h2 className="text-xl font-semibold text-blue-800">Scholarship</h2>
            </div>

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
      <div className="bg-white rounded shadow-md p-6 w-full max-w-4xl m-6 font-nunito">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileUser className="mb-1 w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Scholarship Applicants
            </h2>
          </div>
        </div>

        <div className="overflow-auto h-[370px] rounded border border-gray-200">
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
            {applicants.map((applicant) => (
              <tbody key={applicant.id} className="bg-white text-gray-800">
                <tr className="border-t">
                  <td className="px-4 py-3">{applicant.user_name}</td>
                  <td className="px-4 py-3">{applicant.user_email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded cursor-pointer">
                      {applicant.original_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {dayjs.utc(applicant.created_at).local().format("MMMM D, YYYY h:mm A")}
                  </td>
                  <td className="px-4 py-3">
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </td>
                  <td>
                    <button
                      onClick={() => openDialog(applicant.id!)} 
                      disabled={applicant.status === "approved"}
                      className={`
                            inline-block px-2 py-1 mr-2 text-xs font-semibold rounded cursor-pointer focus:outline-none 
                            ${applicant.status === "pending" 
                              ? "text-green-700 bg-green-100 hover:bg-green-200" 
                              : "text-gray-500 bg-gray-200 cursor-not-allowed"}
                          `}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
      )}
      {!isAssistantshipActive && (
          <div className="bg-white rounded shadow-md p-6 w-full max-w-4xl m-6 font-nunito">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileUser className="mb-1 w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Assistantship Applicants
                </h2>
              </div>
            </div>

            <div className="overflow-auto h-[370px] rounded border border-gray-200">
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
                {assistantshipApplicants.map((applicant) => (
                  <tbody key={applicant.id} className="bg-white text-gray-800">
                    <tr className="border-t">
                      <td className="px-4 py-3">{applicant.user_name}</td>
                      <td className="px-4 py-3">{applicant.user_email}</td>
                      <td className="px-4 py-3 space-y-1">
                        {applicant.files && applicant.files.length > 0 ? (
                          applicant.files.map((file: any) => (
                            <span
                              key={file.id}
                              className="block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded cursor-pointer"
                            >
                              {file.original_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs">No files</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {dayjs.utc(applicant.created_at).local().format("MMMM D, YYYY h:mm A")}
                      </td>
                      <td className="px-4 py-3">
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </td>
                      <td>
                        <button
                          onClick={() => openDialog(applicant.id!)}
                          disabled={applicant.status === "approved"} 
                          className={`
                            inline-block px-2 py-1 mr-2 text-xs font-semibold rounded cursor-pointer focus:outline-none 
                            ${applicant.status === "pending" 
                              ? "text-green-700 bg-green-100 hover:bg-green-200" 
                              : "text-gray-500 bg-gray-200 cursor-not-allowed"}
                          `}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        )}

      <ApproveScholarshipDialog
        dialogRef={dialogRef as React.RefObject<HTMLDialogElement>}
        onConfirm={() => selectedId && handleApproveScholarship(selectedId)}
      />
    </div>
  );
};

export default Applicants;
