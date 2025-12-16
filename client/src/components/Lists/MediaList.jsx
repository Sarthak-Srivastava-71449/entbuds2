import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../api';
import endpoints from '../../api/Wanted';
import Cards from '../Slide/Card';
import TVCards from '../Slide/TVCard';
import { Button } from '@mui/material';
import './MediaList.css';

export default function MediaList({ mediaType = 'movie', genreId = null, title = 'List' }) {
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
        let descriptor;
        if (genreId) {
          descriptor = mediaType === 'movie' ? endpoints.discoverByGenre(genreId, { page }) : endpoints.discoverTV({ page, with_genres: genreId });
        } else {
          descriptor = mediaType === 'movie' ? endpoints.moviePopular({ page }) : endpoints.discoverTV({ page });
        }

        const res = await api.get(descriptor.url, { params: descriptor.params });
        if (!mounted) return;
        const results = res.data.results || [];
        setItems(prev => (page === 1 ? results : [...prev, ...results]));
      } catch (e) {
        // swallow — caller can show error UI
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetcher();
    return () => { mounted = false };
  }, [mediaType, genreId, page]);

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ color: 'white', marginBottom: 12 }}>{title}</h2>
      <div className="listCard">
        {items.map((movie, idx) => (
          mediaType === 'movie' ? <Cards key={movie.id || idx} movie={movie} /> : <TVCards key={movie.id || idx} movie={movie} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <Button variant="contained" color="primary" onClick={() => setPage(p => p + 1)} disabled={loading} style={{ background: 'red' }}>
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </div>
    </div>
  );
}

MediaList.propTypes = {
  mediaType: PropTypes.oneOf(['movie','tv']),
  genreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
};
