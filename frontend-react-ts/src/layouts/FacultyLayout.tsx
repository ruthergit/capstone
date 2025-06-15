import { Outlet } from "react-router-dom"
import FacultyNavbar from "../components/faculty/FacultyNavbar"

const FacultyLayout = () => {
  return (
    <div className="flex box-border">
      <FacultyNavbar/>
      <Outlet/>
    </div>
  )
}

export default FacultyLayout
