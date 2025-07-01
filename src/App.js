import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardAdmin from "./components/BoardAdmin";
import AuthorizePage from "./components/Authorize";

const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);

      // Check if the 'roles' array exists and includes the 'admin' string
      // user.roles will be an array like ['admin', 'user'] or ['user']
      setShowAdminBoard(user.roles && user.roles.includes('admin'));
    }

  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to={"/"} className="text-xl font-bold text-gray-800">
                VNeID Clone
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to={"/home"} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Trang chủ
                  </Link>
                  {showAdminBoard && (
                    <Link to={"/admin"} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Admin Board
                    </Link>
                  )}
                  {currentUser && (
                    <Link to={"/profile"} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              {currentUser ? (
                <div className="ml-4 flex items-center md:ml-6">
                  <Link to={"/profile"} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    {currentUser.email}
                  </Link>
                  <a href="/login" className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={logOut}>
                    Đăng xuất
                  </a>
                </div>
              ) : (
                <div className="ml-4 flex items-center md:ml-6">
                  <Link to={"/login"} className="text-gray-600 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Đăng nhập
                  </Link>
                  <Link to={"/register"} className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-8 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/authorize" element={<AuthorizePage/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;