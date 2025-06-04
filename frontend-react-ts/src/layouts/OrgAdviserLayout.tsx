import { Outlet } from "react-router-dom";
import Navbar from "../components/adviser/AdviserNavbar";

const OrgAdviserLayout = () => {
  return (
    <div className="flex box-border">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default OrgAdviserLayout
