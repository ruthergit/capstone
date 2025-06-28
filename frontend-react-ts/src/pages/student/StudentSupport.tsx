import { GraduationCap, Briefcase } from "lucide-react";
import Header from "../../components/Header";
import { useState, useEffect, useRef } from "react";
import { getScholarship, type Scholarship, applyScholarship } from "../../services/scholarship";
import StudentApplyDialog from "../../components/ui/StudentApplyDialog";
import { useIdStore } from "../../store/ScholarshipId";

const StudentSupport = () => {
  const [isScholarshipActive, setScholarship] = useState(true);
  const toggleScholarship = () => {
    setScholarship(!isScholarshipActive);
  };

  const [scholarships, setScholarshipList] = useState<Scholarship[]>([]);
  useEffect(() => {
    // getting scholarship
    const fetchData = async () => {
      try {
        const data = await getScholarship();
        setScholarshipList(data);

        const pdfNames = data.map((item) => {
          const parts = item.pdf_path.split("/");
          return parts[parts.length - 1];
        });
        console.log(pdfNames);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const id = useIdStore((state) => state.id);
  const setId = useIdStore((state) => state.setId);

  const openDialog = () => {
    dialogRef.current?.showModal();
    console.log(id);
  };

  useEffect(() => {
    if (isScholarshipActive){
      setId(null);
    }
    if (id !== null) {
      openDialog();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleCancel = () => {
    dialogRef.current?.close();
    setSelectedFile(null);
  };

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    file: File;
  }) => {
    try {
      await applyScholarship(id!,formData.name, formData.email, formData.file)
      dialogRef.current?.close();
      setSelectedFile(null);
    } catch (err){
      console.error("Failed to apply scholarship:", err);
    }
    
  };

  return (
    <div className="bg-bg w-full">
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
                Available Scholarships
              </h2>
            </div>
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
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setId(scholarship.id!);
                          console.log(scholarship.name);
                        }}
                        className="inline-block px-2 py-1 text-xs focus:outline-none font-semibold text-green bg-green-100 rounded cursor-pointer"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}
      <StudentApplyDialog
        dialogRef={dialogRef}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default StudentSupport;
