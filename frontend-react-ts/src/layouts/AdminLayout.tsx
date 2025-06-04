import { Outlet } from "react-router-dom";
import Navbar from "../components/admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex box-border">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
