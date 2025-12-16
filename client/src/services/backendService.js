/**
 * Backend Service
 * Centralized service for all custom backend API calls
 * Handles reviews, lists, bookings, and user-specific data
 */

import { API_CONFIG } from '../config/constants';

/**
 * Generic fetch wrapper for backend API calls
 * @param {string} url - Full URL or relative path
 * @param {object} options - Fetch options
 * @returns {Promise} Response JSON
 */
const backendFetch = async (url, options = {}) => {
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
    console.error('Backend API Error:', error);
    throw error;
  }
};

// ============================================
// LIKED MOVIES/LISTS
// ============================================

/**
 * Simple in-memory cache for liked movies per user email.
 * Exposes a promise-based getter so concurrent callers share the same request.
 */
const likedMoviesCache = new Map();

/**
 * Get liked movies for a user (with caching)
 * @param {string} email - User email
 * @returns {Promise} Array of liked movies
 */
export const getLikedMovies = async (email) => {
  if (!email) return Promise.resolve([]);
  
  const key = String(email).toLowerCase();
  
  // Return cached promise if exists
  if (likedMoviesCache.has(key)) {
    return likedMoviesCache.get(key);
  }

  const promise = backendFetch(`${API_CONFIG.BASE_URL}/api/likedmovie/${encodeURIComponent(email)}`)
    .then((data) => {
      if (data && data.msg === 'Success') {
        return data.movies || [];
      }
      return [];
    })
    .catch((error) => {
      console.error('Error fetching liked movies:', error);
      return [];
    });

  // Cache the promise so concurrent calls share the same request
  likedMoviesCache.set(key, promise);
  
  return promise;
};

/**
 * Add movie to user's liked list
 * @param {string} email - User email
 * @param {object} movie - Movie object to add
 * @returns {Promise} Response from server
 */
export const addMovieToLiked = async (email, movie) => {
  if (!email || !movie) {
    throw new Error('Email and movie data are required');
  }

  const result = await backendFetch(`${API_CONFIG.BASE_URL}/api/add`, {
    method: 'POST',
    body: JSON.stringify({ email, data: movie }),
  });

  // Clear cache for this user so next fetch gets fresh data
  likedMoviesCache.delete(String(email).toLowerCase());
  
  return result;
};

/**
 * Remove movie from user's liked list
 * @param {string} email - User email
 * @param {number} movieId - Movie ID to remove
 * @returns {Promise} Response from server
 */
export const removeMovieFromLiked = async (email, movieId) => {
  if (!email || !movieId) {
    throw new Error('Email and movieId are required');
  }

  const result = await backendFetch(`${API_CONFIG.BASE_URL}/api/delete`, {
    method: 'PUT',
    body: JSON.stringify({ email, filmId: movieId }),
  });

  // Clear cache for this user so next fetch gets fresh data
  likedMoviesCache.delete(String(email).toLowerCase());
  
  return result;
};

/**
 * Share user's list with another user
 * @param {string} email - User email
 * @returns {Promise} Share data
 */
export const shareUserList = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }

  return backendFetch(`${API_CONFIG.BASE_URL}/api/share/${email}`);
};

// ============================================
// REVIEWS
// ============================================

/**
 * Post a new review
 * @param {object} reviewData - Review data with title, reviews, etc
 * @returns {Promise} Response from server
 */
export const postReview = async (reviewData) => {
  if (!reviewData?.title) {
    throw new Error('Review title is required');
  }

  return backendFetch(`${API_CONFIG.BASE_URL}/api/review`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

/**
 * Update an existing review
 * @param {string} title - The media title
 * @param {string} reviewId - The review ID to edit
 * @param {string} editedText - The new review text
 * @returns {Promise} Updated review
 */
export const editReview = async (title, reviewId, editedText) => {
  if (!title || !reviewId || !editedText) {
    throw new Error('Title, reviewId, and editedText are required');
  }

  return backendFetch(
    `${API_CONFIG.BASE_URL}/api/review/edit/${encodeURIComponent(title)}/${reviewId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ text: editedText }),
    }
  );
};

/**
 * Delete a review
 * @param {string} title - The media title
 * @param {string} reviewId - The review ID to delete
 * @param {string} username - The username (optional)
 * @returns {Promise} Response from server
 */
export const deleteReview = async (title, reviewId, username = '') => {
  if (!title || !reviewId) {
    throw new Error('Title and reviewId are required');
  }

  return backendFetch(
    `${API_CONFIG.BASE_URL}/api/review/${encodeURIComponent(title)}/${reviewId}`,
    {
      method: 'DELETE',
      body: JSON.stringify({ name: username }),
    }
  );
};

/**
 * Fetch all reviews for a given title
 * @param {string} title - The media title
 * @returns {Promise} Reviews data
 */
export const fetchReviewsByTitle = async (title) => {
  if (!title) {
    throw new Error('Title is required');
  }

  return backendFetch(`${API_CONFIG.BASE_URL}/api/review/${encodeURIComponent(title)}`);
};

/**
 * Fetch single review by title
 * @param {string} title - Review title
 * @returns {Promise} Review data
 */
export const fetchReviewByTitle = async (title) => {
  if (!title) {
    throw new Error('Title is required');
  }

  return backendFetch(`${API_CONFIG.BASE_URL}/api/review/${encodeURIComponent(title)}`);
};

/**
 * Like or unlike a review
 * @param {string} title - The media title
 * @param {string} reviewId - The review ID
 * @param {string} userEmail - The user's email
 * @returns {Promise} Updated review with new like count
 */
export const toggleReviewLike = async (title, reviewId, userEmail) => {
  if (!title || !reviewId || !userEmail) {
    throw new Error('Title, reviewId, and userEmail are required');
  }

  return backendFetch(
    `${API_CONFIG.BASE_URL}/api/review/like/${encodeURIComponent(title)}/${reviewId}/${userEmail}`,
    {
      method: 'PUT',
    }
  );
};

/**
 * Reply to a review
 * @param {string} title - The media title
 * @param {string} reviewId - The review ID to reply to
 * @param {object} replyData - Reply data with text, user name, and user image
 * @returns {Promise} Updated review with new reply
 */
export const replyToReview = async (title, reviewId, replyData) => {
  if (!title || !reviewId || !replyData) {
    throw new Error('Title, reviewId, and replyData are required');
  }

  return backendFetch(
    `${API_CONFIG.BASE_URL}/api/review/reply/${encodeURIComponent(title)}/${reviewId}`,
    {
      method: 'POST',
      body: JSON.stringify(replyData),
    }
  );
};

// ============================================
// BOOKINGS
// ============================================

/**
 * Fetch movie bookings for a city
 * @param {string} city - City name
 * @returns {Promise} Bookings data
 */
export const fetchCityBookings = async (city) => {
  if (!city) {
    throw new Error('City is required');
  }

  return backendFetch(`${API_CONFIG.BASE_URL}/api/movies/${city.toLowerCase()}`);
};

// ============================================
// YOUTUBE REVIEWS
// ============================================

/**
 * Fetch YouTube reviews/trailers for a media title
 * @param {string} title - The media title to search for
 * @param {number} maxResults - Maximum number of results (default: 10)
 * @returns {Promise} YouTube search results
 */
export const fetchYouTubeReviews = async (title, maxResults = 10) => {
  if (!title) {
    throw new Error('Title is required');
  }

  const searchQuery = `${title} movie review`;
  const apiKey = process.env.REACT_APP_API_KEY2;

  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(searchQuery)}&type=video&key=${apiKey}`;

  return backendFetch(url);
};
