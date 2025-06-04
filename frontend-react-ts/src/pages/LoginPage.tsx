import building from "../assets/images/pnc-stuff/pnc-building-2.png";
import header from "../assets/images/pnc-stuff/pnc-header.png";
import hide from "../assets/images/component-img/hide-password.png";
import show from "../assets/images/component-img/view-password.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("/api/login", {
        login_id: loginId,
        password: password,
      },{
        withCredentials: true,
      }
    );

      const { user } = response.data;

      // Store token in localStorage (or any state manager like Redux)
      // localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login success!");
      switch (user.type){
        case "admin":
          navigate("/admin");
          break;
        case "student":
          navigate("/student")
          break;  
        case "student_org":
          navigate("/organization") 
          break; 
        case "org_advisor":
          navigate("/adviser")
          break;
        case "dean":
          navigate("/dean");
          break;
        case "faculty":
          navigate("/faculty")
          break;
        default:
          navigate("/404");
      }

    } catch (err: any) {
      if (err.response && err.response.data?.errors) {
        setError(Object.values(err.response.data.errors).join(" "));
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-teal-600 to-green-600 flex justify-center items-center font-nunito">
      <div className="w-4/6 h-4/5 flex shadow-lg rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="w-[50%] bg-white p-10 box-border flex flex-col justify-center">
          <img src={header} alt="header" className="mb-6 self-center" />
          <h1 className="text-2xl text-center font-extrabold text-green-900 mb-6">
            Student Affairs and Services Department Portal
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-2 mb-10" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="Enter your number"
              />
            </div>

            <div className="relative w-full mt-1">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                value={password}
                type={visible ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="Enter your password"
              />
              <img
                src={visible ? show : hide}
                alt="Toggle visibility"
                onClick={() => setVisible(!visible)}
                className="absolute right-3 top-4/6 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-green text-white font-bold py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="bg-white w-[60%]">
          <img className="h-full object-cover" src={building} alt="pnc-building" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
