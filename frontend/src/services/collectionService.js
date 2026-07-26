import api from "../api/axios";

export const getCollections = async () => {
    const response = await api.get("/api/collections");
    return response.data;
};

export const createCollection = async (data) => {
    const response = await api.post("/api/collections", data);
    return response.data;
};

export const updateCollection = async (id, data) => {
    const response = await api.put(`/api/collections/${id}`, data);
    return response.data;
};

export const deleteCollection = async (id) => {
    await api.delete(`/api/collections/${id}`);
};

export const assignCollection = async (collectionId, linkId) => {
    await api.put(`/api/collections/${collectionId}/assign/${linkId}`);
};

export const removeCollection = async (collectionId, linkId) => {
    await api.delete(`/api/collections/${collectionId}/remove/${linkId}`);
};

export const getCollectionLinks = async (id) => {

    const response = await api.get(`/api/collections/${id}/links`);

    return response.data;

};