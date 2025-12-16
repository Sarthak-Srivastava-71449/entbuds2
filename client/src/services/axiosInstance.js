/**
 * Axios Configuration
 * HTTP client instance with TMDB API configuration
 * Includes interceptors for API key injection
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
});

// Inject API key into every TMDB request
axiosInstance.interceptors.request.use((config) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  if (!apiKey) {
    console.warn('TMDB API key not found in environment variables');
    return config;
  }

  // Ensure params object exists and append api_key
  config.params = {
    ...(config.params || {}),
    api_key: apiKey,
  };
  return config;
});

export default axiosInstance;
