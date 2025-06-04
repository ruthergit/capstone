import { Outlet } from "react-router-dom";
import Navbar from "../components/dean/DeanNavbar";

const DeanLayout = () => {
  return (
    <div className="flex box-border">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default DeanLayout
