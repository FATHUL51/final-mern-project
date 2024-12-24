import "react";
import { Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Login from "./pages/UserLogin";
import Signup from "./pages/UserSignup";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import Home from "./pages/Home";
import Setting from "./pages/Setting";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="/User/Logout"
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="User/Setting"
          element={
            <UserProtectedWrapper>
              <Setting />
            </UserProtectedWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
