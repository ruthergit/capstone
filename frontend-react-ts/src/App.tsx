import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import Chats from "./pages/admin/Chats.tsx";
import Departments from "./pages/admin/Departments.tsx";
import Documents from "./pages/admin/Documents.tsx";
import AdminSchoolEvents from "./pages/admin/SchoolEvents.tsx";
import AdminStudentSupport from "./pages/admin/StudentSupport.tsx";

import StudentLayout from "./layouts/StudentLayout.tsx";
import StudentDashboard from "./pages/student/Dashboard.tsx";
import StudentSupport from "./pages/student/StudentSupport.tsx";
import SchoolEvents from "./pages/student/SchoolEvents.tsx";

import StudentOrgLayout from "./layouts/StudentOrgLayout.tsx";
import StudentOrgDashboard from "./pages/organization/Dashboard.tsx";
import StudentOrgSchoolEvents from "./pages/organization/SchoolEvents.tsx";
import StudentOrgChats from "./pages/organization/Chats.tsx";

import AdviserLayout from "./layouts/OrgAdviserLayout.tsx";
import AdviserDashboard from "./pages/adviser/Dashboard.tsx";
import AdviserSchoolEvents from "./pages/adviser/SchoolEvents.tsx";

import DeanLayout from "./layouts/DeanLayout.tsx";
import DeanDashboard from "./pages/dean/Dashboard.tsx";
import DeanSchoolEvents from "./pages/dean/SchoolEvents.tsx";

import FacultyLayout from "./layouts/FacultyLayout.tsx";
import FacultyDashboard from "./pages/faculty/Dashboard.tsx";

import ProtectedRoute from "./components/ProtectedRoute.tsx";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="document" element={<Documents />} />
          <Route path="departments" element={<Departments />} />
          <Route path="student-support" element={<AdminStudentSupport />} />
          <Route path="school-events" element={<AdminSchoolEvents />} />
          <Route path="chats" element={<Chats />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="student-support" element={<StudentSupport />} />
          <Route path="school-events" element={<SchoolEvents />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student_org"]} />}>
        <Route path="/organization" element={<StudentOrgLayout />}>
          <Route index element={<StudentOrgDashboard />} />
          <Route path="school-events" element={<StudentOrgSchoolEvents />} />
          <Route path="chats" element={<StudentOrgChats />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["org_advisor"]} />}>
        <Route path="/adviser" element={<AdviserLayout />}>
          <Route index element={<AdviserDashboard />} />
          <Route path="school-events" element={<AdviserSchoolEvents />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["dean"]} />}>
        <Route path="/dean" element={<DeanLayout />}>
          <Route index element={<DeanDashboard />} />
          <Route path="school-events" element={<DeanSchoolEvents />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<FacultyDashboard />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
