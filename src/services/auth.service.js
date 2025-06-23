// src/services/auth.service.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

const register = (email, password) => {
  return axios.post(API_URL + "register", {
    email,
    password,
  });
};

const login = (email, password, mfaToken = null) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
      mfaToken,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// === MFA Functions ===
const setupMFA = () => {
  const user = getCurrentUser();
  return axios.post(API_URL + "mfa/setup", {}, {
    headers: {
      "x-access-token": user.accessToken,
    },
  });
};

const verifyMFA = (token) => {
  const user = getCurrentUser();
  return axios.post(API_URL + "mfa/verify", { token }, {
    headers: {
      "x-access-token": user.accessToken,
    },
  });
};

const disableMFA = (password, token) => {
  const user = getCurrentUser();
  return axios.post(API_URL + "mfa/disable", { password, token }, {
    headers: {
      "x-access-token": user.accessToken,
    },
  });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  setupMFA,
  verifyMFA,
  disableMFA,
};

export default AuthService;