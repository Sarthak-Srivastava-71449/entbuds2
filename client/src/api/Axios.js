import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 10000,
});

// Inject API key into every request so callers don't need to remember it.
api.interceptors.request.use((config) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey) return config;

    // Ensure params object exists and append api_key
    config.params = {
        ...(config.params || {}),
        api_key: apiKey,
    };
    return config;
});

export default api;