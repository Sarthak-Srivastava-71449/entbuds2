import React, {useState, useEffect} from 'react';
import "./SearchPage.css";
import axios from '../../api/Axios';
import wants from '../../api/Wanted';
import Cards from '../Slide/Card';


const SearchPage = () => { 

    const [query, setQuery] = useState(''); 
  const [results, setResults] = useState([]); 
  const [page, setPage] = useState(1); 
  const [showload, setshowload] = useState(false); 


  useEffect(() =>{
    if(query){
        axios.get(`${wants.getsearch}&query=${query}&page=${page}`)
        .then(response => {
            setResults(prevMovies => [...prevMovies, ...response.data.results]);
        })
    } else{
        setResults([])
    }
  }, [query, page])

  useEffect(() => {
    if(results && results.length >= 4){
        setshowload(true);
    }else{
        setshowload(false);
    }
  }, [results])

  const InputChange = e => {
    const value = e.target.value;
  setQuery(value);

    if (value) {
      if (results.length > 0) {
        const match = results.find(
          movie =>
          movie.title &&
            movie.title.toLowerCase() === value.toLowerCase()
        );
        if (match) {
          setResults([match]);
        } else {
          setResults([]);
        }
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div>
        <br />
        <br />
        <br />

         <br />
         <br />
         <br />
      <input type="text"  className="searchbar" placeholder="  Search for a movie" value={query} onChange={InputChange}  style={{ color: 'white', fontSize: '12px', paddingLeft: "1em" }} />
      <br />
      <br />
      <br />
      <div className='searchresults'>
      {results.map((result, index) => (
        <Cards key={index} movie={result} />
      ))}
      </div>
      {showload && (<button onClick={() => setPage(prevPage => prevPage + 1)}>Load More</button>)}
    </div>
  )
}

export default SearchPage
