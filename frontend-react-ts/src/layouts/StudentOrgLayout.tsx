import { Outlet } from "react-router-dom";
import Navbar from "../components/studentorg/StudentOrgNavbar";

const StudentOrgLayout = () => {
  return (
     <div className="flex box-border">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default StudentOrgLayout
