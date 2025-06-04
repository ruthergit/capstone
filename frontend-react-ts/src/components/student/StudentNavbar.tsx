import header from "../../assets/images/pnc-stuff/pnc-header.png";
import menu from "../../assets/images/pnc-stuff/menu.png";
import Dashboard from '../../assets/images/component-img/Dashboard-Icon.svg?react';
import Student from '../../assets/images/component-img/Student-icon.svg?react';
import Calendar from '../../assets/images/component-img/Calendar-icon.svg?react';
import Drop from '../../assets/images/component-img/Drop-icon.svg?react';
import Profile from '../../assets/images/component-img/Profile-icon.svg?react';
import { NavLink, useLocation } from "react-router-dom";


const StudentNavbar = () => {
  const location = useLocation();

  const linkClass = ({isActive}: {isActive: boolean}) => isActive ?
  'flex items-center gap-4 bg-green text-white p-2 rounded':
  'flex items-center gap-4 text-font-color p-2 rounded hover:bg-green-100';

  const iconFilter = (path: string) =>
    location.pathname === path ? "filter brightness-0 invert" : "";

  return (
    <nav className="border-r border-border h-[100vh] w-[23vw] font-nunito flex flex-col">
      <div className="border-b border-border h-14 flex justify-center items-center gap-8">
        <img src={header} className="w-44" alt="" />
        <img src={menu} className="w-5" alt="" />
      </div>
      <div className="flex-1">
        <ul className="flex flex-col px-5 py-6 gap-3">
          <NavLink to="/student" end className={linkClass}>
              <Dashboard className={`w-4.5 ${iconFilter("/student")}`} /><p>Dashboard</p>
          </NavLink>
          <NavLink to="/student/student-support" className={linkClass}>
            <Student className={`w-4.5 ${iconFilter("/student/student-support")}`} /><p>Student Support</p>
          </NavLink>
          <NavLink to="/student/school-events" className={linkClass}>
            <Calendar className={`w-4.5 ${iconFilter("/student/school-events")}`}/><p>School Events</p>
          </NavLink>
          
        </ul>
      </div>

      <div className="h-20 px-6 py-6 flex justify-between items-center text-font-color">
            <div className="flex justify-center items-center gap-3">
              <Profile className=""/>
              <h1>Ara Christina Ceres</h1>
            </div>
            <button className="">
              <Drop className="w-3 mr-4 rotate-180" />
              <Drop className="w-3 mr-4 " />
            </button>
            
      </div>
    </nav>
  )
}

export default StudentNavbar
