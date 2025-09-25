import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { getUsersByLoginIds, type User } from "../../services/user";

// ---- Org Types ----
interface Org {
  id: string;
  name: string;
  members?: User[];
}

// ---- Sample Orgs ----
const studentGovOrgs: Org[] = [
  { id: "usg", name: "USG" },
  { id: "ccs-sg", name: "CCS-SG" },
  { id: "cas-sg", name: "CAS-SG" },
  { id: "cbaa-sg", name: "CBAA-SG" },
  { id: "chas-sg", name: "CHAS-SG" },
  { id: "coed-sg", name: "COED-SG" },
  { id: "coe-sg", name: "COE-SG" },
];

const academicOrgs: Org[] = [
  { id: "math-club", name: "Math Club" },
  { id: "cs-society", name: "Computer Science Society" },
];

const nonAcademicOrgs: Org[] = [
  { id: "dance-club", name: "Dance Club" },
  { id: "music-club", name: "Music Club" },
];

// ---- Reusable Section ----
interface OrgSectionProps {
  title: string;
  orgs: Org[];
  users?: User[]; // optional if you need to display members
}

const OrgSection = ({ title, orgs, users }: OrgSectionProps) => {
  return (
    <div className="my-6">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      {orgs.map((org) => (
        <div
          key={org.id}
          className="collapse collapse-arrow bg-white shadow-md rounded mb-2"
        >
          <input type="radio" name={`accordion-${title}`} />
          <div className="collapse-title font-semibold">{org.name}</div>
          <div className="collapse-content text-sm">
            {/* Example: only CCS-SG shows members */}
            {org.id === "ccs-sg" && users ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-3 rounded shadow-sm mb-2 text-sm"
                >
                  <p>
                    <strong>{user.name}</strong>
                  </p>
                </div>
              ))
            ) : (
              <p>Click the "Sign Up" button in the top right corner.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---- Main Component ----
const Departments = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Example: user IDs to fetch (can be from backend, state, or props)
  const userIds = ["1000001", "1000000", "1000002"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsersByLoginIds(userIds);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-bg w-full">
      <Header title="Organizations" />
      <div className="px-6 py-6 font-nunito gap-1 flex flex-col h-[calc(100vh-60px)] overflow-y-auto">
        <OrgSection
          title="Student Government Organizations"
          orgs={studentGovOrgs}
          users={users}
        />
        <OrgSection title="Academic Organizations" orgs={academicOrgs} />
        <OrgSection title="Non-Academic Organizations" orgs={nonAcademicOrgs} />
      </div>
    </div>
  );
};

export default Departments;
