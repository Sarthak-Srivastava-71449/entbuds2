/**
 * TMDB Service
 * Centralized service for all The Movie Database API calls
 * All TMDB-related API endpoints and functions are consolidated here
 */

import axiosInstance from './axiosInstance';

/**
 * Fetch popular movies
 * @param {number} page - Page number for pagination
 * @param {object} additionalParams - Any additional query parameters
 * @returns {Promise} Movie data
 */
export const fetchPopularMovies = (page = 1, additionalParams = {}) => {
  return axiosInstance.get('/movie/popular', {
    params: {
      language: 'en-US',
      page,
      ...additionalParams,
    },
  });
};

/**
 * Fetch top-rated movies
 * @param {number} page - Page number for pagination
 * @param {object} additionalParams - Any additional query parameters
 * @returns {Promise} Movie data
 */
export const fetchTopRatedMovies = (page = 1, additionalParams = {}) => {
  return axiosInstance.get('/movie/top_rated', {
    params: {
      language: 'en-US',
      page,
      ...additionalParams,
    },
  });
};

/**
 * Search for movies, TV shows, and people
 * @param {string} query - Search query
 * @param {number} page - Page number for pagination
 * @param {object} additionalParams - Any additional query parameters
 * @returns {Promise} Search results
 */
export const searchMedia = (query, page = 1, additionalParams = {}) => {
  if (!query) {
    throw new Error('Query is required');
  }

  return axiosInstance.get('/search/multi', {
    params: {
      query,
      page,
      ...additionalParams,
    },
  });
};

/**
 * Discover movies by genre
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number for pagination
 * @param {object} additionalParams - Any additional query parameters (sort_by, etc.)
 * @returns {Promise} Movie data
 */
export const fetchMoviesByGenre = (genreId, page = 1, additionalParams = {}) => {
  if (!genreId) {
    throw new Error('Genre ID is required');
  }

  return axiosInstance.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
      ...additionalParams,
    },
  });
};

/**
 * Get detailed information about a specific movie
 * @param {number} id - Movie ID
 * @param {object} additionalParams - Any additional query parameters
 * @returns {Promise} Movie details
 */
export const fetchMovieDetails = (id, additionalParams = {}) => {
  if (!id) {
    throw new Error('Movie ID is required');
  }

  return axiosInstance.get(`/movie/${id}`, {
    params: {
      language: 'en-US',
      ...additionalParams,
    },
  });
};

/**
 * Discover TV shows
 * @param {number} page - Page number for pagination
 * @param {object} additionalParams - Any additional query parameters
 * @returns {Promise} TV show data
 */
export const fetchTVShows = (page = 1, additionalParams = {}) => {
  return axiosInstance.get('/discover/tv', {
    params: {
      page,
      ...additionalParams,
    },
  });
};

/**
 * Discover TV shows by genre
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number for pagination
 * @param {object} additionalParams - Any additional query parameters
 * @returns {Promise} TV show data
 */
export const fetchTVShowsByGenre = (genreId, page = 1, additionalParams = {}) => {
  if (!genreId) {
    throw new Error('Genre ID is required');
  }

  return axiosInstance.get('/discover/tv', {
    params: {
      with_genres: genreId,
      page,
      ...additionalParams,
    },
  });
};

/**
 * Get detailed information about a specific TV show
 * @param {number} id - TV show ID
 * @param {object} additionalParams - Any additional query parameters
 * @returns {Promise} TV show details
 */
export const fetchTVDetails = (id, additionalParams = {}) => {
  if (!id) {
    throw new Error('TV ID is required');
  }

  return axiosInstance.get(`/tv/${id}`, {
    params: {
      language: 'en-US',
      ...additionalParams,
    },
  });
};

/**
 * Genre IDs for easy reference
 */
export const GENRE_IDS = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};
