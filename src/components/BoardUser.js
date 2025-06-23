import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const BoardUser = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
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
       <h3 className="text-2xl font-bold mb-4">User Board</h3>
       <p>{content}</p>
    </div>
  );
};

export default BoardUser;