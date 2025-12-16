import { useState, useCallback, useEffect } from 'react';
import axios from '../api/Axios';

/**
 * Custom hook for fetching data from API
 * Handles loading, error, and data states
 * @param {string} url - The API endpoint
 * @param {object} options - Additional options for the request
 * @returns {object} { data, isLoading, error, refetch }
 */
export const useFetchData = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(url, options);
      setData(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

/**
 * Custom hook for debounced values
 * Useful for search inputs and autocomplete
 * @param {any} value - The value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
