import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import './Book.css';
import imagenot from './nopost.png';
import Autosuggest from 'react-autosuggest';
import cityList from './Cities';

const Book = () => {
  const [moviebooks, setMoviebooks] = useState([]);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_DATABASE}/api/movies/jalandhar`)
  //     .then(response => response.json())
  //     .then(data => {
  //       const links = data.movies.map(movie => movie.bookingUrl);
  //       setMoviebooks(links);
  //     })
  //     .catch(error => {
  //       console.log('Error fetching movie data:', error);
  //     });
  // }, []);

  const fetchMovies = useCallback(async (cityArg = null) => {
    try {
      const cityToshow = cityArg || city || 'mumbai';
      const response = await fetch(`${process.env.REACT_APP_DATABASE}/api/movies/${cityToshow}`);
      const data = await response.json();
      const { movies } = data;
      setMoviebooks(movies);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  }, [city]);

  useEffect(() => {
    // initial load
    fetchMovies();
  }, [fetchMovies]);
  

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : cityList.filter(city =>
      city.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const renderSuggestion = suggestion => (
    <span className="suggestion-item">{suggestion}</span>
  );

  const renderSuggestionsContainer = ({ containerProps, children }) => (
    <div {...containerProps} className="suggestions-container">
      {children}
    </div>
  );
  

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (_, { suggestion }) => {
    setCity(suggestion.toLowerCase());
  };

  const inputProps = {
    placeholder: 'Enter city',
    value: city,
    onChange: (_, { newValue }) => setCity(newValue),
    className: 'ticketsearch',
    style: { color: 'white', fontSize: '12px', paddingLeft: "1em" },
  };

  return (
    <div style={{minHeight: "90vh"}}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br /><br />


      <div className='ticketsearcher'>
      
      <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={value => value}
          renderSuggestion={renderSuggestion}
          renderSuggestionsContainer={renderSuggestionsContainer}
          inputProps={inputProps}
        />
      <Button style={{
                fontSize: "1rem",
                width: "9vw",
                background: "red",         
                color: "white",                
                textDecoration: "none"
              }} onClick={fetchMovies}>Let's Go</Button>
      </div>
      <br />
      <br />
      <br />

      {moviebooks.map((link, index) => (
        <div className='bookcard' key={index}>
          
          <img className='book-img' src={link.posterUrl || imagenot} alt='poster'></img>
          <div className='bookbtn'>
          <a href={link.bookingUrl} target="_blank" rel="noopener noreferrer">
          <Button style={{
                fontSize: "1.2rem",
                background: " rgba(0, 0, 0, 0.7)",
                width: "14vw",           
                color: "red",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}><ArrowRightAltIcon fontSize='large'  /></Button>
        </a>
          </div>
          <div className='book-overlay'>
          <div className="book-title">
            <h2>{link.title}</h2>
            </div>
           
          </div>
        
        </div>
      ))}
      
    </div>
  )
}

export default Book
