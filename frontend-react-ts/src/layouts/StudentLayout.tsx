import { Outlet } from "react-router-dom";
import Navbar from "../components/student/StudentNavbar";

const StudentLayout = () => {
  return (
    <div className="flex box-border">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default StudentLayout;
