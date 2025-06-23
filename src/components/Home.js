import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600">VNeID Clone</h1>
        <p className="text-lg text-gray-700">
          Chào mừng bạn đến với VNeID Clone – Hệ thống quản lý danh tính điện tử.
        </p>
        <p className="text-gray-600">
          Vui lòng <a href="/login" className="text-blue-500 hover:underline">đăng nhập</a> hoặc{" "}
          <a href="/register" className="text-green-500 hover:underline">đăng ký</a> để bắt đầu.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Đăng nhập</a>
          <a href="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Đăng ký</a>
        </div>
      </div>
    </div>
  );
};

export default Home;