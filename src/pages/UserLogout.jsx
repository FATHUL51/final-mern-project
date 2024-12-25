import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handlesubmit = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/logout",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("logou sucessful");
        localStorage.removeItem("token");
        navigate("/Login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button
        className="bg-[#050505] text-white font-semibold mb-3 rounded px-4 py-2  w-full "
        onClick={() => handlesubmit()}
      >
        Logout
      </button>
    </div>
  );
};

export default UserLogout;
