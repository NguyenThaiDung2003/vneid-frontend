// --- Cập nhật service để có các hàm quản lý profile ---
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/user/';

// Lấy thông tin hồ sơ chi tiết
const getProfile = () => {
    return axios.get(API_URL + 'profile', { headers: authHeader() });
};

// Cập nhật thông tin hồ sơ
const updateProfile = (data) => {
    return axios.put(API_URL + 'profile', data, { headers: authHeader() });
};

// Upload ảnh đại diện
const uploadAvatar = (file) => {
    let formData = new FormData();
    formData.append("avatar", file);
    return axios.post(API_URL + 'upload/avatar', formData, {
        headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
        }
    });
};

// Upload ảnh CCCD
const uploadIdCard = (frontFile, backFile) => {
    let formData = new FormData();
    formData.append("front", frontFile);
    formData.append("back", backFile);
    return axios.post(API_URL + 'upload/idcard', formData, {
        headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
        }
    });
};


const UserService = {
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadIdCard,
};
export default UserService;