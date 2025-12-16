import React, { useState, useEffect, useCallback } from 'react';
import Cards from '../Slide/Card';
import { searchMedia } from '../../services/tmdbService';
import { getErrorMessage } from '../../utils/apiHelpers';
import { ERROR_MESSAGES } from '../../config/constants';
import './SearchPage.css';

/**
 * SearchPage component for movie/TV search functionality
 * Handles query input and paginated results display
 */
const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch search results from API
   */
  useEffect(() => {
    if (!query) {
      setResults([]);
      setPage(1);
      return;
    }

    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await searchMedia(query, page);
        const data = response.data;

        if (data && data.results) {
          setResults((prevResults) =>
            page === 1 ? data.results : [...prevResults, ...data.results]
          );
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(getErrorMessage(err) || ERROR_MESSAGES.FETCH_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 300); // Debounce search requests

    return () => clearTimeout(timer);
  }, [query, page]);

  /**
   * Update visibility of "Load More" button based on results count
   */
  useEffect(() => {
    setIsLoadMoreVisible(results.length >= 4);
  }, [results]);

  /**
   * Handle input change and filter results
   */
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setPage(1);

    if (!value) {
      setResults([]);
      return;
    }

    // Filter results in real-time for better UX
    if (results.length > 0) {
      const filtered = results.filter((movie) => {
        const title = movie.original_title || movie.original_name || '';
        return title.toLowerCase().includes(value.toLowerCase());
      });
      setResults(filtered);
    }
  }, [results]);

  /**
   * Handle load more button click
   */
  const handleLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* Search Input */}
      <input
        type="text"
        className="searchbar"
        placeholder="Search for a movie"
        value={query}
        onChange={handleInputChange}
        style={{ color: 'white', fontSize: '12px', paddingLeft: '1em' }}
        aria-label="Search movies"
      />

      {/* Error Message */}
      {error && (
        <div style={{ color: '#d32f2f', padding: '1em', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Loading Message */}
      {isLoading && (
        <div style={{ color: '#fff', padding: '1em', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {/* Results */}
      <div className="searchresults">
        {results.length === 0 && query && !isLoading && (
          <div style={{ color: '#fff', padding: '1em', textAlign: 'center' }}>
            {ERROR_MESSAGES.NO_MOVIES}
          </div>
        )}
        {results.map((result) => (
          <Cards key={result.id} movie={result} />
        ))}
      </div>

      {/* Load More Button */}
      {isLoadMoreVisible && !isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: '0.5em 2em',
              background: '#e53935',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

SearchPage.propTypes = {};

export default SearchPage;
