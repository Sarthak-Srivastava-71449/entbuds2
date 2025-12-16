import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchPopularMovies, fetchMoviesByGenre, fetchTVShows, fetchTVShowsByGenre } from '../../services/tmdbService';
import Cards from '../Slide/Card';
import TVCards from '../Slide/TVCard';
import { Button } from '@mui/material';
import './MediaList.css';

export default function MediaList({ mediaType = 'movie', genreId = null, title = 'List', onHome = false }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [mediaType, genreId]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetcher = async () => {
      try {
        let response;
        
        if (genreId) {
          // Fetch by genre
          response = mediaType === 'movie' 
            ? await fetchMoviesByGenre(genreId, page)
            : await fetchTVShowsByGenre(genreId, page);
        } else {
          // Fetch popular
          response = mediaType === 'movie' 
            ? await fetchPopularMovies(page)
            : await fetchTVShows(page);
        }

        if (!mounted) return;
        const results = response.data?.results || [];
        setItems(prev => (page === 1 ? results : [...prev, ...results]));
      } catch (e) {
        console.error('Error fetching media:', e);
        // swallow — caller can show error UI
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetcher();
    return () => { mounted = false };
  }, [mediaType, genreId, page]);

  return (
    <div style={{ padding: '24px 12px' }}>
      {/* Container constrains to viewport and prevents page horizontal overflow */}
      <div className="listContainer">
        {/* Header: title left, Load More button right when onHome */}
        <div className="listHeader">
          <h2 className="listTitle">{title}</h2>
          {onHome ? (
            <div className="listActions">
              <Button variant="contained" color="primary" onClick={() => setPage(p => p + 1)} disabled={loading} style={{ background: 'red' }}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          ) : null}
        </div>

        <div className={"listCard" + (onHome ? ' horizontal' : '')}>
          {items.map((movie, idx) => (
            mediaType === 'movie' ? <Cards key={movie.id || idx} movie={movie} /> : <TVCards key={movie.id || idx} movie={movie} />
          ))}
        </div>
      </div>

      {/* When not onHome, keep the Load More centered under the list (original behavior) */}
      {!onHome && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <Button variant="contained" color="primary" onClick={() => setPage(p => p + 1)} disabled={loading} style={{ background: 'red' }}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}

MediaList.propTypes = {
  mediaType: PropTypes.oneOf(['movie','tv']),
  genreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};
