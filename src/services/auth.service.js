// src/services/auth.service.js
import apiClient from './api.config';

const API_PREFIX = '/auth';

const register = (userData) => {
    const { email, password, firstName, lastName } = userData;
    return apiClient.post(`${API_PREFIX}/register`, {
        email,
        password,
        firstName,
        lastName,
    });
};

const login = (email, password, mfaToken = null) => {
    return apiClient
        .post(`${API_PREFIX}/login`, {
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
    return apiClient.post(`${API_PREFIX}/logout`)
        .then(() => {
            localStorage.removeItem("user");
        })
        .catch(() => {
            // Always remove user from localStorage even if logout fails
            localStorage.removeItem("user");
        });
};

const refreshToken = () => {
    return apiClient.post(`${API_PREFIX}/refresh`);
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

// === MFA Functions ===
const setupMFA = () => {
    return apiClient.post(`${API_PREFIX}/mfa/setup`);
};

const verifyMFA = (otp) => {
    return apiClient.post(`${API_PREFIX}/mfa/verify`, { otp });
};

const disableMFA = (password, otp) => {
    return apiClient.post(`${API_PREFIX}/mfa/disable`, { password, otp });
};
const sendDisable=()=>{
    return apiClient.post(`${API_PREFIX}/mfa/senddisableotp`);
}
const AuthService = {
    register,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    setupMFA,
    verifyMFA,
    disableMFA,
    sendDisable,
};

export default AuthService;
