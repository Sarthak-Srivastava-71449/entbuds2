/**
 * Constants for the application
 * Centralized place for magic strings, colors, and configuration
 */

// Color Palette
export const COLORS = {
  PRIMARY: '#e53935',
  PRIMARY_DARK: '#c62828',
  BACKGROUND: '#000000',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#b0bec5',
  OVERLAY: 'rgba(0, 0, 0, 0.7)',
  ERROR: '#d32f2f',
  SUCCESS: '#388e3c',
  WARNING: '#f57c00',
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_DATABASE || 'http://localhost:3001',
  TMDB_BASE_URL: 'https://image.tmdb.org/t/p/original',
  YOUTUBE_BASE_URL: 'https://www.youtube.com',
};

// Default Cities for Booking
export const DEFAULT_CITY = 'mumbai';

// Image Dimensions
export const IMAGE_SIZES = {
  CARD_WIDTH: '100%',
  CARD_HEIGHT: '300px',
  POSTER_WIDTH: '200px',
  BACKDROP_WIDTH: '100%',
};

// UI Configuration
export const UI_CONFIG = {
  SKELETON_ANIMATION_DURATION: 2100,
  CAROUSEL_TRANSITION_TIME: 2100,
  CAROUSEL_AUTOPLAY_DELAY: 4000,
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_ERROR: 'Failed to fetch data. Please try again.',
  REVIEW_ERROR: 'Failed to post review. Please try again.',
  NO_MOVIES: 'No movies found.',
  UNKNOWN_GENRE: 'Unknown genre',
  FILL_FIELD: 'Please fill the required field',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REVIEW_POSTED: 'Review posted successfully!',
  MOVIE_ADDED: 'Movie added to your list!',
  MOVIE_REMOVED: 'Movie removed from your list!',
};
