import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = process.env.REACT_API_BASE_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Gửi cookie (refreshToken)
});

// Hàm gọi refresh token
const refreshToken = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Refresh token error:", err);
    throw err;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) return config;

    const user = JSON.parse(userJSON);
    const accessToken = user?.accessToken;
    if (!accessToken) return config;

    const decodedToken = jwtDecode(accessToken);
    const now = Date.now() / 1000;

    if (decodedToken.exp < now) {
      try {
        const data = await refreshToken();
        const updatedUser = {
          ...user,
          accessToken: data.accessToken,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;
      } catch (err) {
        console.error("Could not refresh token:", err);
        localStorage.removeItem("user");
        window.location.href = "/login"; // hoặc redirect về trang login
        return Promise.reject(err);
      }
    } else {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);


export default apiClient;