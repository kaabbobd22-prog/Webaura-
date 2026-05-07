import axios from 'axios';

const getCleanURL = () => {
    const rawURL = import.meta.env.VITE_API_URL || 'https://webaura-bz32.onrender.com/api';
    return rawURL.replace(/['";\s]/g, ''); 
};

const api = axios.create({
    baseURL: getCleanURL()
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('wm_admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;