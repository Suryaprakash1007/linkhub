import api from '../api/axios';

const suggestMetadata = async (url) => {
    const response = await api.post('/api/ai/suggest', { url });
    return response.data;
};

const chat = async (message) => {
    const response = await api.post('/api/ai/chat', { message });
    return response.data;
};

export const aiService = {
    suggestMetadata,
    chat,
};
