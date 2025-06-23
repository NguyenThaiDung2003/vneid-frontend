import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [requireMFA, setRequireMFA] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const { email, password, mfaToken } = data;
      const response = await AuthService.login(
        email,
        password,
        requireMFA ? mfaToken : null
      );

      if (response.requireMFA) {
        setRequireMFA(true);
        setLoading(false);
        setMessage(
          "Vui lòng nhập mã xác thực 2 lớp từ ứng dụng của bạn."
        );
      } else {
        navigate("/profile");
        window.location.reload();
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.message || error.message || "Lỗi không xác định"
      );
      setLoading(false);
    }
  };

  const resetMFA = () => {
    setRequireMFA(false);
    setMessage("");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Đăng nhập</h3>
        <p className="text-gray-600 mt-2">Đăng nhập vào tài khoản VNeID của bạn</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {!requireMFA ? (
          <>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa chỉ email"
                {...register("email", { required: "Email không được để trống" })}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu"
                {...register("password", { required: "Mật khẩu không được để trống" })}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>
          </>
        ) : (
          <div className="mb-6">
            <label htmlFor="mfaToken" className="block text-gray-700 text-sm font-bold mb-2">
              Mã xác thực 2 lớp
            </label>
            <input
              id="mfaToken"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength="6"
              {...register("mfaToken", { required: "Vui lòng nhập mã 2FA" })}
            />
            {errors.mfaToken && <span className="text-red-500 text-sm">{errors.mfaToken.message}</span>}

            <p className="text-sm text-gray-600 mt-2">
              Nhập mã 6 chữ số từ ứng dụng Google Authenticator hoặc tương tự.
            </p>
            <button
              type="button"
              onClick={resetMFA}
              className="text-blue-500 hover:text-blue-700 text-sm mt-2"
            >
              ← Quay lại đăng nhập thường
            </button>
          </div>
        )}

        <div className="mb-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            disabled={loading}
          >
            {loading && (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            )}
            <span>{requireMFA ? "Xác thực" : "Đăng nhập"}</span>
          </button>
        </div>

        {message && (
          <div className="mb-4">
            <div
              className={`p-3 rounded ${
                requireMFA && !message.includes("không hợp lệ")
                  ? "bg-blue-100 border border-blue-400 text-blue-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-500 hover:text-blue-700">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
