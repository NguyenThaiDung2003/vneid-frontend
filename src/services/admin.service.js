// src/services/admin.service.js
import apiClient from './api.config';

const API_PREFIX = '/admin';

// Get dashboard statistics
const getDashboard = () => {
    return apiClient.get(`${API_PREFIX}/dashboard`);
};

// Get all users with filtering and pagination
const getAllUsers = (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', verification = '' } = params;
    
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        verification
    });
    
    return apiClient.get(`${API_PREFIX}/users?${queryParams}`);
};

// Get user details by ID
const getUserDetails = (userId) => {
    return apiClient.get(`${API_PREFIX}/users/${userId}`);
};

// Update user verification status (theo backend controller)
const updateVerificationStatus = (userId, status, notes = '') => {
    return apiClient.put(`${API_PREFIX}/users/${userId}/verification`, {
        status,
        notes // backend expects 'notes' not 'note'
    });
};

// Toggle user active status
const toggleUserStatus = (userId) => {
    return apiClient.put(`${API_PREFIX}/users/${userId}/status`);
};

// Update user role (theo backend controller)
const updateUserRole = (userId, roleIds) => {
    return apiClient.put(`${API_PREFIX}/users/${userId}/role`, {
        roleIds // backend expects array of role IDs
    });
};

const AdminService = {
    getDashboard,
    getAllUsers,
    getUserDetails,
    updateVerificationStatus,
    toggleUserStatus,
    updateUserRole,
};

export default AdminService;