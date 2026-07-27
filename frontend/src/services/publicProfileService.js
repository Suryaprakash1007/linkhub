import axios from "axios";

// Since this is public, we don't use the authenticated api instance
const API_URL = import.meta.env.VITE_API_BASE_URL 
    ? `${import.meta.env.VITE_API_BASE_URL}/api/public/users` 
    : "http://localhost:8080/api/public/users";

export const getPublicProfile = async (username) => {
    const response = await axios.get(`${API_URL}/${username}`);
    return response.data;
};

export const getPublicLinks = async (username) => {
    const response = await axios.get(`${API_URL}/${username}/links`);
    return response.data;
};
