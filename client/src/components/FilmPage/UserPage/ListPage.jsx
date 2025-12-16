import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import Cards from '../../Slide/Card';
import { API_CONFIG } from '../../../config/constants';
import './ListPage.css';

/**
 * ListPage component
 * Displays user's liked movies and allows sharing the list
 */
const ListPage = () => {
  const { user } = useAuth0();
  const [likedMovies, setLikedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  /**
   * Fetch liked movies for the user
   */
  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true;

    const fetchLikedMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/likedmovie/${user.email}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          if (data.msg === 'Success') {
            setLikedMovies(data.movies || []);
          } else {
            setError('Failed to load liked movies');
          }
        }
      } catch (err) {
        console.error('Error fetching liked movies:', err);
        if (isMounted) {
          setError(err.message || 'Failed to fetch liked movies');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLikedMovies();

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  /**
   * Remove a movie from the liked list
   */
  const handleRemoveMovie = useCallback((movieId) => {
    setLikedMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  }, []);

  /**
   * Share the liked movies list
   */
  const handleShareList = useCallback(async () => {
    if (!user?.email) return;

    try {
      setIsSharing(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/share/${user.email}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.msg === 'Success' && data.shareLink) {
        window.open(data.shareLink, '_blank');
      } else {
        alert('Failed to generate share link');
      }
    } catch (err) {
      console.error('Error sharing list:', err);
      alert('Failed to share list. Please try again.');
    } finally {
      setIsSharing(false);
    }
  }, [user?.email]);

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* Error Message */}
      {error && (
        <div style={{ color: '#d32f2f', padding: '1em', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={{ color: 'white', padding: '1em', textAlign: 'center' }}>
          Loading your list...
        </div>
      )}

      {/* Movies List */}
      {!isLoading && (
        <>
          <div className="list">
            {likedMovies.length > 0 ? (
              likedMovies.map((movie) => (
                <Cards
                  key={movie.id}
                  movie={movie}
                  onRemove={handleRemoveMovie}
                />
              ))
            ) : (
              <p style={{ color: 'white', gridColumn: '1 / -1', textAlign: 'center' }}>
                No movies in your list yet!
              </p>
            )}
          </div>

          {/* Share Button */}
          {likedMovies.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
              <Button
                onClick={handleShareList}
                disabled={isSharing}
                sx={{
                  fontSize: '1rem',
                  width: '9vw',
                  background: '#e53935',
                  color: 'white',
                  '&:hover': {
                    background: '#c62828',
                  },
                  '&:disabled': {
                    background: '#999',
                  },
                }}
              >
                {isSharing ? 'Sharing...' : 'Share List'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

ListPage.propTypes = {};

export default ListPage;
