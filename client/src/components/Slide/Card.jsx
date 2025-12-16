import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useAuth0 } from '@auth0/auth0-react';
import { getLikedMovies, addMovieToLiked, removeMovieFromLiked } from '../../services/backendService';
import { getTMDBImageUrl, truncateText } from '../../utils/apiHelpers';
import { COLORS, UI_CONFIG } from '../../config/constants';
import './Card.css';

/**
 * Card component for displaying movie/TV show information
 * Handles liked/favorites functionality for authenticated users
 */
const Card = ({ movie, onRemove, mediaType = 'movie' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  // Simulate loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, UI_CONFIG.SKELETON_ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Fetch liked status for current movie
  useEffect(() => {
    let isMounted = true;

    const checkIfLiked = async () => {
      if (!movie || !isAuthenticated || !user?.email) {
        setIsLiked(false);
        return;
      }

      try {
        const likedMovies = await getLikedMovies(user.email);
        if (isMounted) {
          const liked = (likedMovies || []).some((m) => m.id === movie.id);
          setIsLiked(liked);
        }
      } catch (error) {
        console.error('Error checking liked status:', error);
        if (isMounted) setIsLiked(false);
      }
    };

    checkIfLiked();

    return () => {
      isMounted = false;
    };
  }, [movie, user?.email, isAuthenticated]);

  /**
   * Add movie to liked list
   */
  const handleAddToLiked = useCallback(
    async (event) => {
      event.preventDefault();

      if (!user?.email) {
        console.error('User email not available');
        return;
      }

      try {
        setIsLiked(true);
        await addMovieToLiked(user.email, movie);
      } catch (error) {
        console.error('Error adding to liked:', error);
        setIsLiked(false);
      }
    },
    [user?.email, movie]
  );

  /**
   * Remove movie from liked list
   */
  const handleDeleteFromLiked = useCallback(
    async (event) => {
      event.preventDefault();

      if (!user?.email) {
        console.error('User email not available');
        return;
      }

      try {
        setIsLiked(false);
        await removeMovieFromLiked(user.email, movie.id);

        // Notify parent to remove from list if on a list page
        if (onRemove) {
          onRemove(movie.id);
        }
      } catch (error) {
        console.error('Error removing from liked:', error);
        setIsLiked(true);
      }
    },
    [user?.email, movie.id, onRemove]
  );

  return (
    <>
      {isLoading ? (
        <div className="card">
          <div className="skeleton" />
        </div>
      ) : (
        <Link
          to={mediaType === 'tv' ? `/series/${movie.id}` : `/movie/${movie.id}`}
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <div className="card">
            {/* Movie Poster */}
            <img
              className="cards-img"
              alt={movie?.original_title || movie?.original_name || 'Movie poster'}
              src={getTMDBImageUrl(movie?.poster_path)}
            />

            {/* Like/Unlike Button */}
            {isAuthenticated && (
              <div className="btnlike">
                {!isLiked ? (
                  <Button
                    sx={{
                      fontSize: '1.2rem',
                      background: COLORS.OVERLAY,
                      width: '100%',
                      color: COLORS.PRIMARY,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.9)',
                      },
                    }}
                    onClick={handleAddToLiked}
                  >
                    <FavoriteBorderIcon fontSize="medium" />
                  </Button>
                ) : (
                  <Button
                    sx={{
                      fontSize: '1.2rem',
                      background: COLORS.OVERLAY,
                      width: '100%',
                      color: COLORS.PRIMARY,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.9)',
                      },
                    }}
                    onClick={handleDeleteFromLiked}
                  >
                    <DeleteOutlineOutlinedIcon fontSize="medium" />
                  </Button>
                )}
              </div>
            )}

            {/* Card Overlay with Information */}
            <div className="card-overlay">
              <div className="card-title">
                {movie?.original_title || movie?.original_name || 'Unknown'}
              </div>
              <div className="card-runtime">
                {movie?.release_date || movie?.first_air_date || 'N/A'}
                <span className="card-rating">
                  {movie?.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
              <div className="card-desc">
                {truncateText(movie?.overview, 118)}
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

Card.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    poster_path: PropTypes.string,
    original_title: PropTypes.string,
    original_name: PropTypes.string,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func,
  mediaType: PropTypes.oneOf(['movie', 'tv']),
};

Card.defaultProps = {
  mediaType: 'movie',
  onRemove: undefined,
};

export default Card;
