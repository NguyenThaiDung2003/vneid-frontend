// src/services/user.service.js
import apiClient from './api.config';

const API_PREFIX = '/user';

// Lấy thông tin hồ sơ chi tiết
const getProfile = () => {
    return apiClient.get(`${API_PREFIX}/profile`);
};

// Cập nhật thông tin hồ sơ
const updateProfile = (profileData) => {
    const { firstName, lastName, phoneNumber, dateOfBirth,address,gender ,idNumber} = profileData;
    return apiClient.put(`${API_PREFIX}/profile`, {
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth,
        address,
        gender,
        idNumber,
    });
};

// Upload ảnh đại diện
const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.post(`${API_PREFIX}/upload/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

// Upload ảnh CCCD (theo cấu trúc backend)
const uploadIdCard = (frontFile, backFile) => {
    const formData = new FormData();
    formData.append("front", frontFile);
    if (backFile) {
        formData.append("back", backFile);
    }
    return apiClient.post(`${API_PREFIX}/upload/idcard`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

// Gửi yêu cầu xác minh
const requestVerification = () => {
    return apiClient.post(`${API_PREFIX}/verify`);
};
const getVerificationStatus = () => {
    return apiClient.get(`${API_PREFIX}/verification/status`);
};
const fetchUserProfile = () => {
  return apiClient.get('/user/full-profile');
};
const updateUserHealth = (healthData) => {
    const   {height, weight, bloodType,chronicDiseases, allergies}=healthData
  return apiClient.put(`${API_PREFIX}/health`,  {height, weight,bloodType,chronicDiseases, allergies});
};
const UserService = {
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadIdCard,
    requestVerification,
    getVerificationStatus,
    fetchUserProfile,
    updateUserHealth
};

export default UserService;