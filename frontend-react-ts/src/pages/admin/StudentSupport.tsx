import { GraduationCap, Briefcase, CirclePlus } from "lucide-react";
import Header from "../../components/Header";
import { useState, useEffect, useRef } from "react";
import { getScholarship, type Scholarship, addScholarship } from "../../services/scholarship";
import ScholarshipDialog from "../../components/ui/ScholarshipDialog";

const StudentSupport = () => {
  const [isScholarshipActive, setScholarship] = useState(true);
  const [scholarships, setScholarshipList] = useState<Scholarship[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInsertedNewData, setIsInsertedNewData] = useState(false);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };
  const closeDialog = () => {
    dialogRef.current?.close();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const toggleScholarship = () => {
    setScholarship(!isScholarshipActive);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScholarship();
        setScholarshipList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [isInsertedNewData, scholarships]);

  const handleSubmitScholarship = async (formData: {
    name: string;
    file: File;
  }) => {
    try {
      await addScholarship(formData.name, formData.file);
      closeDialog();
      setSelectedFile(null);
      setIsInsertedNewData(true);
    } catch (err) {
      console.error("Failed to add scholarship:", err);
    }
  };

  return (
    <div className="bg-bg w-full min-h-screen font-nunito">
      <Header title="Student Support" />

      {isScholarshipActive && (
        <div>
          {/* Instruction */}
          <div className="text-center mt-6">
            <p className="text-gray-700 text-xl font-semibold">
              Please select a category below to get started.
            </p>
          </div>

          {/* Choices */}
          <div
            onClick={toggleScholarship}
            className="mx-6 my-6 flex h-2/7 gap-4 justify-center items-center"
          >
            {/* Scholarship Choice */}
            <div className="w-full flex flex-col shadow-md items-center justify-center p-8 rounded bg-white hover:bg-blue-100 cursor-pointer transition">
              <GraduationCap className="w-12 h-12 text-blue-700 mb-2" />
              <h2 className="text-xl font-semibold text-blue-800">
                Scholarship
              </h2>
            </div>

            {/* Assistantship Choice */}
            <div className="w-full flex flex-col shadow-md items-center justify-center p-8 rounded bg-white hover:bg-green-100 cursor-pointer transition">
              <Briefcase className="w-12 h-12 text-green-700 mb-2" />
              <h2 className="text-xl font-semibold text-green-800">
                Assistantship
              </h2>
            </div>
          </div>
        </div>
      )}

      {!isScholarshipActive && (
        <div className="bg-white font-nunito text-black rounded mx-6 my-6 shadow-md h-[83vh] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-7" />
              <h2 className="text-lg font-semibold text-gray-800">
                Scholarship
              </h2>
            </div>
            <div>
              <button
                onClick={openDialog}
                className="flex items-center gap-1.5 border-gray-300 rounded px-3 py-1 text-sm text-gray-700 shadow-sm hover:bg-green-50 focus:outline-none"
              >
                Add Scholarship
                <CirclePlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-auto h-[370px] rounded border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 font-medium">Scholarship Title</th>
                  <th className="px-4 py-2 font-medium">Application Form</th>
                  <th className="px-4 py-2 font-medium">Applicants</th>
                </tr>
              </thead>
              {scholarships.map((scholarship) => (
                <tbody key={scholarship.id} className="bg-white text-gray-800">
                  <tr className="border-t">
                    <td className="px-4 py-3">{scholarship.name}</td>
                    <td className="px-4 py-3">
                      <span
                        onClick={() =>
                          window.open(
                            `http://127.0.0.1:8000/preview-pdf/${scholarship.pdf_path
                              .split("/")
                              .pop()}`,
                            "_blank"
                          )
                        }
                        className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded cursor-pointer"
                      >
                        {scholarship.original_name}
                      </span>
                    </td>
                    <td className="px-4 py-3">0</td>
                  </tr>

                  {/* Add more rows as needed */}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}
      <ScholarshipDialog
        dialogRef={dialogRef as React.RefObject<HTMLDialogElement>}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        onCancel={closeDialog}
        onSubmit={handleSubmitScholarship}
      />
    </div>
  );
};

export default StudentSupport;
