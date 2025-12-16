import { useState, useCallback, useEffect } from 'react';
import axios from '../api/Axios';
import { API_CONFIG } from '../config/constants';

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
 * Custom hook for making POST/PUT requests
 * @param {string} url - The API endpoint
 * @returns {object} { execute, isLoading, error, data }
 */
export const useMutate = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (method = 'POST', payload = null, customUrl = null) => {
      try {
        setIsLoading(true);
        setError(null);
        const finalUrl = customUrl || url;
        const response = await axios({
          method,
          url: finalUrl,
          data: payload,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        console.error('Mutation error:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  return { execute, isLoading, error, data };
};

/**
 * Custom hook for managing liked movies
 * @param {string} userEmail - The user's email
 * @returns {object} { likedMovies, addLike, removeLike, isLoading }
 */
export const useLikedMovies = (userEmail) => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    const fetchLikedMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/likedmovie/${userEmail}`
        );
        const data = await response.json();

        if (data.msg === 'Success') {
          setLikedMovies(data.movies || []);
        }
      } catch (err) {
        console.error('Error fetching liked movies:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedMovies();
  }, [userEmail]);

  const addLike = useCallback(
    async (movie) => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            data: movie,
          }),
        });

        if (!response.ok) throw new Error('Failed to add like');

        setLikedMovies((prev) => [...prev, movie]);
        return true;
      } catch (err) {
        console.error('Error adding like:', err);
        setError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userEmail]
  );

  const removeLike = useCallback(
    async (movieId) => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/delete`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            filmId: movieId,
          }),
        });

        if (!response.ok) throw new Error('Failed to remove like');

        setLikedMovies((prev) => prev.filter((m) => m.id !== movieId));
        return true;
      } catch (err) {
        console.error('Error removing like:', err);
        setError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userEmail]
  );

  return { likedMovies, addLike, removeLike, isLoading, error };
};

/**
 * Custom hook for form input handling
 * @param {object} initialValues - Initial form values
 * @returns {object} { values, setValues, handleChange, reset }
 */
export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return { values, setValues, handleChange, reset };
};

/**
 * Custom hook for debounced values
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
