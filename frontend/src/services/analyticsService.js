import api from "../api/axios";
import { getMyLinks } from "./linkService";

export const getLinks = async () => {
    return await getMyLinks(0);
};

export const getHistory = async (linkId) => {
    const response = await api.get(`/api/links/${linkId}/history`);
    return response.data;
};

export const getAnalytics = async (linkId) => {
    const response = await api.get(`/api/analytics/${linkId}`);
    return response.data;
};
