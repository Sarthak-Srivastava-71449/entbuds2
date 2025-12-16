/**
 * Utility functions for API calls and error handling
 * Provides centralized API service layer for all components
 */

import { API_CONFIG, ERROR_MESSAGES } from '../config/constants';

/**
 * Parse API error response and return user-friendly message
 * @param {Error | Response} error - Error object or response
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || ERROR_MESSAGES.FETCH_ERROR;
  }
  if (error.message) {
    // Don't leak internal errors to user
    if (error.message.includes('HTTP error')) {
      return ERROR_MESSAGES.FETCH_ERROR;
    }
    return error.message;
  }
  return ERROR_MESSAGES.FETCH_ERROR;
};

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

/**
 * Build image URL from TMDB path
 * @param {string} path - TMDB image path
 * @param {string} size - Image size (optional)
 * @returns {string} Full image URL
 */
export const getTMDBImageUrl = (path, size = 'original') => {
  if (!path) return '';
  return `${API_CONFIG.TMDB_BASE_URL}${path}`;
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '—';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '—';
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 118, suffix = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
};

/**
 * Format rating with one decimal place
 * @param {number} rating - Rating value
 * @returns {string} Formatted rating
 */
export const formatRating = (rating) => {
  if (typeof rating !== 'number') return '—';
  return rating.toFixed(1);
};

/**
 * Build YouTube embed URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} Embed URL
 */
export const getYouTubeEmbedUrl = (videoId) => {
  return `${API_CONFIG.YOUTUBE_BASE_URL}/embed/${videoId}`;
};

/**
 * Check if movie is in liked list
 * @param {Array} likedMovies - Array of liked movies
 * @param {number} movieId - Movie ID to check
 * @returns {boolean} Is liked
 */
export const isMovieLiked = (likedMovies, movieId) => {
  return Array.isArray(likedMovies) && likedMovies.some((m) => m.id === movieId);
};

/**
 * Get movie title from object
 * @param {object} movie - Movie object
 * @returns {string} Movie title
 */
export const getMovieTitle = (movie) => {
  if (!movie) return '';
  return movie.original_title || movie.original_name || 'Unknown';
};

/**
 * Get media release date
 * @param {object} media - Media object (movie or TV show)
 * @param {string} mediaType - Type of media ('movie' or 'tv')
 * @returns {string} Release date
 */
export const getMediaDate = (media, mediaType = 'movie') => {
  if (!media) return '';
  return mediaType === 'movie' ? media.release_date : media.first_air_date;
};
