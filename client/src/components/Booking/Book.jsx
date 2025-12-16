import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Autosuggest from 'react-autosuggest';
import cityList from './Cities';
import { DEFAULT_CITY } from '../../config/constants';
import { fetchCityBookings } from '../../services/backendService';
import { getErrorMessage } from '../../utils/apiHelpers';
import './Book.css';
import imagenot from './nopost.png';

/**
 * Book component for movie ticket booking
 * Allows users to search for movies in different cities
 */
const Book = () => {
  const [movieBooks, setMovieBooks] = useState([]);
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch movies for a given city
   */
  const fetchMovies = useCallback(async (cityArg = null) => {
    try {
      setIsLoading(true);
      setError(null);
      const cityToShow = cityArg || city || DEFAULT_CITY;
      const data = await fetchCityBookings(cityToShow);
      setMovieBooks(data.movies || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      setMovieBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [city]);

  /**
   * Load initial movies on component mount
   */
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  /**
   * Get city suggestions based on input
   */
  const getSuggestions = useCallback((value) => {
    const inputValue = value.trim().toLowerCase();
    if (inputValue.length === 0) return [];

    return cityList.filter((cityItem) =>
      cityItem.toLowerCase().startsWith(inputValue)
    );
  }, []);

  /**
   * Render individual suggestion item
   */
  const renderSuggestion = (suggestion) => (
    <span className="suggestion-item">{suggestion}</span>
  );

  /**
   * Render suggestions container
   */
  const renderSuggestionsContainer = ({ containerProps, children }) => (
    <div {...containerProps} className="suggestions-container">
      {children}
    </div>
  );

  /**
   * Handle suggestions fetch
   */
  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  /**
   * Handle suggestions clear
   */
  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  /**
   * Handle suggestion selection
   */
  const handleSuggestionSelected = (_, { suggestion }) => {
    setCity(suggestion.toLowerCase());
  };

  /**
   * Handle "Let's Go" button click
   */
  const handleSearch = useCallback(() => {
    fetchMovies(city || DEFAULT_CITY);
  }, [city, fetchMovies]);

  const inputProps = {
    placeholder: 'Enter city',
    value: city,
    onChange: (_, { newValue }) => setCity(newValue),
    className: 'ticketsearch',
    style: { color: 'white', fontSize: '12px', paddingLeft: '1em' },
    'aria-label': 'Enter city for movie bookings',
  };

  return (
    <div style={{ minHeight: '90vh' }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* Search Section */}
      <div className="ticketsearcher">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleSuggestionsClearRequested}
          onSuggestionSelected={handleSuggestionSelected}
          getSuggestionValue={(value) => value}
          renderSuggestion={renderSuggestion}
          renderSuggestionsContainer={renderSuggestionsContainer}
          inputProps={inputProps}
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          sx={{
            fontSize: '1rem',
            width: '9vw',
            background: '#e53935',
            color: 'white',
            textDecoration: 'none',
            '&:hover': {
              background: '#c62828',
            },
            '&:disabled': {
              background: '#999',
            },
          }}
          endIcon={<ArrowRightAltIcon />}
        >
          {isLoading ? 'Loading...' : "Let's Go"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ color: '#d32f2f', padding: '1em', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Movies Grid */}
      <div className="books">
        {movieBooks.length > 0 ? (
          movieBooks.map((movie) => (
            <div key={movie.id} className="book">
              <img
                src={movie.image || imagenot}
                alt={movie.title}
                className="book-image"
              />
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
            </div>
          ))
        ) : (
          !isLoading && (
            <p style={{ color: 'white', gridColumn: '1 / -1', textAlign: 'center' }}>
              No movies found. Try another city!
            </p>
          )
        )}
      </div>
    </div>
  );
};

Book.propTypes = {};

export default Book;
