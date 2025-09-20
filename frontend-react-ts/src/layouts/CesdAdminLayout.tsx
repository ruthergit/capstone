import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/cesdAdmin/AdminNavbar";

const CesdAdminLayout = () => {
  return (
    <div className='flex box-border'>
      <AdminNavbar/>
      <Outlet/>
    </div>
  )
}

export default CesdAdminLayout
