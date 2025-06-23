// src/services/admin.service.js
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/admin/';

// Get dashboard statistics
const getDashboard = () => {
    return axios.get(API_URL + 'dashboard', { headers: authHeader() });
};

// Get all users with filtering and pagination
const getAllUsers = (page = 1, limit = 10, search = '', status = '', verification = '') => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        verification
    });
    
    return axios.get(API_URL + `users?${params}`, { headers: authHeader() });
};

// Get user details by ID
const getUserDetails = (userId) => {
    return axios.get(API_URL + `users/${userId}`, { headers: authHeader() });
};

// Update user verification status
const updateVerificationStatus = (userId, status, note = '') => {
    return axios.put(API_URL + `users/${userId}/verification`, {
        status,
        note
    }, { headers: authHeader() });
};

// Toggle user active status
const toggleUserStatus = (userId) => {
    return axios.put(API_URL + `users/${userId}/status`, {}, { headers: authHeader() });
};

// Update user role
const updateUserRole = (userId, role) => {
    return axios.put(API_URL + `users/${userId}/role`, {
        role
    }, { headers: authHeader() });
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