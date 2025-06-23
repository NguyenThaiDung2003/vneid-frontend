import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const BoardAdmin = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    // This is a placeholder call. In a real app, this would fetch admin-specific data.
    // For now, we reuse an existing service call for demonstration.
    // Replace with a real admin service call when available.
    UserService.getProfile().then( // Placeholder call
      (response) => {
        setContent("Đây là nội dung chỉ dành cho Admin. Bạn có thể thấy trang này vì bạn có vai trò 'admin'.");
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Admin Board</h3>
      <p>{content}</p>
    </div>
  );
};

export default BoardAdmin;