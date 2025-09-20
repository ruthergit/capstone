import header from "../../assets/images/pnc-stuff/pnc-header.png";
import menu from "../../assets/images/pnc-stuff/menu.png";
import Dashboard from "../../assets/images/component-img/Dashboard-Icon.svg?react";
import Department from "../../assets/images/component-img/Departments-icon.svg?react";
import Student from "../../assets/images/component-img/Student-icon.svg?react";
import Calendar from "../../assets/images/component-img/Calendar-icon.svg?react";
import Chats from "../../assets/images/component-img/Chats-icon.svg?react";
import Drop from "../../assets/images/component-img/Drop-icon.svg?react";
import Profile from "../../assets/images/component-img/Profile-icon.svg?react";
import { Plus } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthTokenStore } from "../../store/useAuthTokenStore";
import { useUserStore } from "../../store/useUserStore";
import { useState, useEffect, useRef } from "react";
import {
  getScholarship,
  type Scholarship,
  addScholarship,
} from "../../services/scholarship";
import {
  getAssistantship,
  type Assistantship,
  addAssistantship,
} from "../../services/assistantship";
import ScholarshipDialog from "../../components/ui/ScholarshipDialog";
import AssistantshipDialog from "../../components/ui/AssistantshipDialog";

const AdminNavbar = () => {
  const [scholarships, setScholarshipList] = useState<Scholarship[]>([]);
  const [assistantships, setAssistantshipList] = useState<Assistantship[]>([]);
  const [scholarshipOpen, setScholarshipOpen] = useState(false);
  const [assistantshipOpen, setAssistantshipOpen] = useState(false);

  const fetchScholarships = async () => {
    try {
      const data = await getScholarship();
      setScholarshipList(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchAssistantships = async () => {
    try {
      const data = await getAssistantship();
      setAssistantshipList(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchAssistantships();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { clearToken } = useAuthTokenStore();
  const { clearUser, user } = useUserStore();
  const [isdropDownActive, setDropDown] = useState(false);
  const [isStudentOpen, setStudentOpen] = useState(false);

  const handleToggle = () => {
    setDropDown(!isdropDownActive);
  };

  const handleLogout = () => {
    clearToken();
    clearUser();
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center gap-4 bg-green text-white p-2 rounded"
      : "flex items-center gap-4 text-font-color p-2 rounded hover:bg-green-100";

  const iconFilter = (path: string) =>
    location.pathname === path ? "filter brightness-0 invert" : "";

  const scholarshipDialogRef = useRef<HTMLDialogElement>(null);
  const assistantshipDialogRef = useRef<HTMLDialogElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openScholarshipDialog = () => scholarshipDialogRef.current?.showModal();
  const closeScholarshipDialog = () => scholarshipDialogRef.current?.close();

  const openAssistantshipDialog = () => assistantshipDialogRef.current?.showModal();
  const closeAssistantshipDialog = () => assistantshipDialogRef.current?.close();

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

   // Submit Handlers
  const handleSubmitScholarship = async (formData: { name: string; file: File }) => {
    try {
      await addScholarship(formData.name, formData.file);
      closeScholarshipDialog();
      setSelectedFile(null);
      fetchScholarships();
    } catch (err) {
      console.error("Failed to add scholarship:", err);
    }
  };

  const handleSubmitAssistantship = async (formData: { name: string; description:string; file: File }) => {
    try {
      await addAssistantship(formData.name, formData.description, formData.file);
      closeAssistantshipDialog();
      setSelectedFile(null);
      fetchAssistantships();
    } catch (err) {
      console.error("Failed to add assistantship:", err);
    }
  };

  return (
    <nav className="border-r border-border h-[100vh] w-[23vw] font-nunito flex flex-col">
      <div className="border-b border-border h-14 flex justify-center items-center gap-8">
        <img src={header} className="w-44" alt="" />
        <img src={menu} className="w-5" alt="" />
      </div>
      <div className="flex-1">
        <ul className="flex flex-col px-5 py-6 gap-3">
          <NavLink to="/admin" end className={linkClass}>
            <Dashboard className={`w-4.5 ${iconFilter("/admin")}`} />
            <p>Dashboard</p>
          </NavLink>
          <NavLink to="/admin/departments" className={linkClass}>
            <Department
              className={`w-4.5 ${iconFilter("/admin/departments")}`}
            />
            <p>Departments</p>
          </NavLink>

          <NavLink to="/admin/school-events" className={linkClass}>
            <Calendar
              className={`w-4.5 ${iconFilter("/admin/school-events")}`}
            />
            <p>School Events</p>
          </NavLink>
          <NavLink to="/admin/chats" className={linkClass}>
            <Chats className={`w-4.5 ${iconFilter("/admin/chats")}`} />
            <p>Chats</p>
          </NavLink>

          {/* Student Services with Dropdown */}
          <li>
            <button
              onClick={() => setStudentOpen(!isStudentOpen)}
              className="flex items-center justify-between w-full text-left text-font-color p-2 rounded hover:bg-green-100"
            >
              <span className="flex items-center gap-4">
                <Student
                  className={`w-4.5 ${iconFilter("/admin/student-support")}`}
                />
                <p>Student Services</p>
              </span>
              <Drop
                className={`w-3 transition-transform ${
                  isStudentOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isStudentOpen && (
              <ul className="ml-10 mt-2 flex flex-col gap-2">
                {/* Scholarship Dropdown */}
                <li>
                  <button
                    onClick={() => {
                      setScholarshipOpen((prev) => !prev);
                      if (!scholarshipOpen) setAssistantshipOpen(false); // close assistantship if opening scholarship
                    }}
                    className="flex items-center justify-between w-full text-left text-font-color p-2 rounded hover:bg-green-50"
                  >
                    <span>Scholarship</span>
                    <Drop
                      className={`w-3 transition-transform ${
                        scholarshipOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {scholarshipOpen && (
                    <ul className="ml-6 mt-1 flex flex-col gap-1">
                      {scholarships.map((scholarship) => (
                        <NavLink
                          key={scholarship.id}
                          to={`/admin/scholarships/${scholarship.id}`}
                          className="text-sm text-font-color"
                        >
                          {scholarship.name}
                        </NavLink>
                      ))}
                      <button
                        onClick={openScholarshipDialog}
                        className="mt-2 flex items-center text-green-600 text-sm hover:underline"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Scholarship
                      </button>
                    </ul>
                  )}
                </li>

                {/* Assistantship Dropdown */}
                <li>
                  <button
                    onClick={() => {
                      setAssistantshipOpen((prev) => !prev);
                      if (!assistantshipOpen) setScholarshipOpen(false); // close scholarship if opening assistantship
                    }}
                    className="flex items-center justify-between w-full text-left text-font-color p-2 rounded hover:bg-green-50"
                  >
                    <span>Assistantship</span>
                    <Drop
                      className={`w-3 transition-transform ${
                        assistantshipOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {assistantshipOpen && (
                    <ul className="ml-6 mt-1 flex flex-col gap-1">
                      {assistantships.map((assistantship) => (
                        <NavLink
                          key={assistantship.id}
                          to={`/admin/assistantships/${assistantship.id}`}
                          className="text-sm text-font-color"
                        >
                          {assistantship.name}
                        </NavLink>
                      ))}
                      <button
                        onClick={openAssistantshipDialog}
                        className="mt-2 flex items-center text-green-600 text-sm hover:underline"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Assistantship
                      </button>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* User + Logout */}
      <div className="h-20 px-6 py-6 flex justify-between items-center text-font-color relative">
        <div className="flex justify-center items-center gap-3">
          <Profile className="" />
          <h1>{user?.name}</h1>
        </div>
        <button onClick={handleToggle} className="hover:opacity-70 transition">
          <Drop className="w-3 mr-4 rotate-180" />
          <Drop className="w-3 mr-4" />
        </button>
        {isdropDownActive && (
          <button
            onClick={handleLogout}
            className="w-fit flex rounded items-center p-3 h-5 absolute top-0 right-1 shadow-md"
          >
            <p className="hover:bg-red-500 hover:text-white px-1 rounded ">
              Logout
            </p>
          </button>
        )}
      </div>
      {/* Dialogs */}
      <ScholarshipDialog
        dialogRef={scholarshipDialogRef}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        onCancel={closeScholarshipDialog}
        onSubmit={handleSubmitScholarship}
      />

      <AssistantshipDialog
        dialogRef={assistantshipDialogRef}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        onCancel={closeAssistantshipDialog}
        onSubmit={handleSubmitAssistantship}
      />
    </nav>
  );
};

export default AdminNavbar;
