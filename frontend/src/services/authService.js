import api from "../api/axios";

export const loginUser = async (data) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
};

export const registerUser = async (data) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
};

export const forgotPassword = async (data) => {
    const response = await api.post("/api/auth/forgot-password", data);
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await api.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
};

export const resetPassword = async (data) => {
    const response = await api.post("/api/auth/reset-password", data);
    return response.data;
};
