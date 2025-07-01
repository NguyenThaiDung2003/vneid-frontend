import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = (data) => {
    setMessage("");
    setSuccessful(false);

    AuthService.register(data).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
        <form onSubmit={handleSubmit(handleRegister)}>
          {!successful && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  {...register("email", { required: "Email là bắt buộc" })}
                />
                 {errors.email && <p className="text-red-500 text-xs italic mt-2">{errors.email.message}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  {...register("password", { 
                    required: "Mật khẩu là bắt buộc",
                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                  })}
                />
                 {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                  Tạo tài khoản
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4">
              <div className={`p-4 rounded ${successful ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`} role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;