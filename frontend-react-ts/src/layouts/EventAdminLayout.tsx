import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/eventAdmin/AdminNavbar";

const EventAdminLayout = () => {
  return (
    <div className='flex box-border'>
      <AdminNavbar/>
      <Outlet/>
    </div>
  )
}

export default EventAdminLayout
