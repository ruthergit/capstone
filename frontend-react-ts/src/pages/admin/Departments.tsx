import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { getUsersByLoginIds, type User } from "../../services/user";

const Departments = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Example: user IDs to fetch (can be from backend, state, or props)
  const userIds = ["1000001","1000000", "1000002",]; // change this to dynamic source if needed

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
      <Header title="Deparments" />

      <div className="mx-6 my-6 font-nunito gap-1 flex flex-col">
        <div className="collapse collapse-arrow bg-white shadow-md rounded  ">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold">
            College of Computing Studies
          </div>
          <div className="collapse-content text-sm">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-3 rounded shadow-sm mb-2 text-sm"
              >
                <p>
                  <strong>{user.name}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="collapse collapse-arrow bg-white shadow-md rounded  ">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold">
            College of Engineering
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
        <div className="collapse collapse-arrow bg-white shadow-md rounded  ">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold">
            College of Education
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
        <div className="collapse collapse-arrow bg-white shadow-md rounded  ">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold">
            College of Health and Allied Sciences
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
        <div className="collapse collapse-arrow bg-white shadow-md rounded  ">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold">
            College of Business, Accountancy and Administration
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
        <div className="collapse collapse-arrow bg-white shadow-md rounded  ">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold">
            College of Arts and Sciences
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
        <div className="collapse collapse-arrow bg-white shadow-md rounded  ">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold">
            University Student Government
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
