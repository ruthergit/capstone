import header from "../../assets/images/pnc-stuff/pnc-header.png";
import menu from "../../assets/images/pnc-stuff/menu.png";
import Dashboard from "../../assets/images/component-img/Dashboard-Icon.svg?react";
import Calendar from "../../assets/images/component-img/Calendar-icon.svg?react";
import Drop from "../../assets/images/component-img/Drop-icon.svg?react";
import Profile from "../../assets/images/component-img/Profile-icon.svg?react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthTokenStore } from "../../store/useAuthTokenStore";
import { useUserStore } from "../../store/useUserStore";
import { useState } from "react";

const FacultyNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearToken } = useAuthTokenStore();
  const { clearUser, user } = useUserStore();
  const [isdropDownActive, setDropDown] = useState(false);

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

  return (
    <nav className="border-r border-border h-[100vh] w-[23vw] font-nunito flex flex-col">
      <div className="border-b border-border h-14 flex justify-center items-center gap-8">
        <img src={header} className="w-44" alt="" />
        <img src={menu} className="w-5" alt="" />
      </div>
      <div className="flex-1">
        <ul className="flex flex-col px-5 py-6 gap-3">
          <NavLink to="/faculty" end className={linkClass}>
            <Dashboard className={`w-4.5 ${iconFilter("/faculty")}`} />
            <p>Dashboard</p>
          </NavLink>
        </ul>
      </div>

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
    </nav>
  );
};

export default FacultyNavbar;
