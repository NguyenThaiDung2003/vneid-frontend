// src/services/verification.service.js
import apiClient from './api.config';

const API_PREFIX = '/verification';

// Upload và xác minh CCCD
const uploadAndVerifyIdCard = (frontFile, backFile = null) => {
    const formData = new FormData();
    formData.append("front", frontFile);
    if (backFile) {
        formData.append("back", backFile);
    }
    
    return apiClient.post(`${API_PREFIX}/upload-verify`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds for OCR processing
    });
};

// Lấy trạng thái xác minh
const getVerificationStatus = () => {
    return apiClient.get(`${API_PREFIX}/status`);
};

// Admin: Xem xét xác minh
const reviewVerification = (userId, action, notes = '') => {
    return apiClient.put(`${API_PREFIX}/review/${userId}`, {
        action, // 'approve' | 'reject'
        notes
    });
};

// Admin: Lấy danh sách xác minh chờ duyệt
const getPendingVerifications = (page = 1, limit = 10) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });
    
    return apiClient.get(`${API_PREFIX}/pending?${params}`);
};

const VerificationService = {
    uploadAndVerifyIdCard,
    getVerificationStatus,
    reviewVerification,
    getPendingVerifications,
};

export default VerificationService;
