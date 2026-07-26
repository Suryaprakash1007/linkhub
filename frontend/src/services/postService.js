import api from "../api/axios";

export const getPosts = async () => {
    const response = await api.get("/api/posts");
    return response.data;
};

export const getPostById = async (id) => {
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
};

export const createPost = async (data) => {
    const response = await api.post("/api/posts", data);
    return response.data;
};

export const updatePost = async (id, data) => {
    const response = await api.put(`/api/posts/${id}`, data);
    return response.data;
};

export const deletePost = async (id) => {
    await api.delete(`/api/posts/${id}`);
};

export const likePost = async (id) => {
    await api.post(`/api/posts/${id}/like`);
};

export const unlikePost = async (id) => {
    await api.delete(`/api/posts/${id}/unlike`);
};

