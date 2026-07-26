import api from "../api/axios";

export const getDashboard = async () => {
    const response = await api.get("/api/links/dashboard");
    return response.data;
};