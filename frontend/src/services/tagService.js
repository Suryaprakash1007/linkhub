import api from "../api/axios";

export const getTags = async () => {
    const response = await api.get("/api/tags");
    return response.data;
};

export const createTag = async (data) => {
    const response = await api.post("/api/tags", data);
    return response.data;
};

export const updateTag = async (id, data) => {
    const response = await api.put(`/api/tags/${id}`, data);
    return response.data;
};

export const deleteTag = async (id) => {
    await api.delete(`/api/tags/${id}`);
};

export const getTagLinks = async (id) => {
    const response = await api.get(`/api/tags/${id}/links`);
    return response.data;
};

export const assignTag = async (linkId, tagId) => {

    const response = await api.put(
        `/api/links/${linkId}/tags/${tagId}`
    );

    return response.data;

};

export const getMyTags = async () => {

    const response = await api.get("/api/tags");

    return response.data;

};