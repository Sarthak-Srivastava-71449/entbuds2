import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../../../api';
import endpoints from '../../../api/Wanted';
import YTReviews from '../YTReviews/YTReviews';
import UserReviews from '../UserReviews/UserReviews';
import {
  getTMDBImageUrl,
  formatDate,
  formatRating,
  getMovieTitle,
  postReview,
  fetchReviewByTitle,
} from '../../../utils/apiHelpers';
import { ERROR_MESSAGES } from '../../../config/constants';
import './MediaPage.css';

/**
 * MediaPage component
 * Displays detailed information about a movie or TV show with reviews
 */
const MediaPage = ({ mediaType = 'movie' }) => {
  const { id } = useParams();
  const { user } = useAuth0();
  const [mediaData, setMediaData] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [renderToggle, setRenderToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPostingReview, setIsPostingReview] = useState(false);

  /**
   * Fetch media details
   */
  useEffect(() => {
    let isMounted = true;

    const fetchMediaDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const descriptor =
          mediaType === 'movie'
            ? endpoints.movieDetails(id, { language: 'en-US' })
            : endpoints.tvDetails(id, { language: 'en-US' });

        const response = await api.get(descriptor.url, {
          params: descriptor.params,
        });

        if (isMounted && response.data) {
          setMediaData(response.data);
        }

        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching media details:', err);
        if (isMounted) {
          setError(err.message || ERROR_MESSAGES.FETCH_ERROR);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMediaDetails();

    return () => {
      isMounted = false;
    };
  }, [id, mediaType]);

  /**
   * Handle posting a review
   */
  const handlePostReview = useCallback(async () => {
    if (!reviewText.trim()) {
      alert(ERROR_MESSAGES.FILL_FIELD);
      return;
    }

    if (!mediaData) return;

    try {
      setIsPostingReview(true);
      const title = getMovieTitle(mediaData);

      // Check if review exists
      let checkData;
      try {
        checkData = await fetchReviewByTitle(title);
      } catch (err) {
        // Review doesn't exist yet, which is fine
        checkData = { exist: false };
      }

      // Post the review
      await postReview({
        title,
        exist: checkData.exist,
        reviews: {
          review: reviewText,
          name: user?.name,
          image: user?.picture,
        },
      });

      setRenderToggle(!renderToggle);
      setReviewText('');
    } catch (err) {
      console.error('Error posting review:', err);
      alert('Failed to post review. Please try again.');
    } finally {
      setIsPostingReview(false);
    }
  }, [reviewText, mediaData, renderToggle, user?.name, user?.picture]);

  if (isLoading) {
    return (
      <div style={{ color: 'white', padding: '2em', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: '#d32f2f', padding: '2em', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  if (!mediaData) {
    return (
      <div style={{ color: 'white', padding: '2em', textAlign: 'center' }}>
        No data available
      </div>
    );
  }

  const title = getMovieTitle(mediaData);
  const releaseDate =
    mediaType === 'movie'
      ? mediaData.release_date
      : mediaData.first_air_date;
  const rating = mediaData.vote_average;
  const homepage = mediaData.homepage || '';
  const imdbId = mediaData.imdb_id || '';

  return (
    <div className="chosen">
      {/* Hero Section with Backdrop */}
      <div className="hero-section">
        <img
          className="backdrop-img"
          src={getTMDBImageUrl(mediaData.backdrop_path)}
          alt="backdrop"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content Section */}
      <div className="content-wrapper">
        <div className="main-container">
          {/* Poster Section */}
          <div className="poster-section">
            <div className="poster-card">
              <img
                className="poster-img"
                src={getTMDBImageUrl(mediaData.poster_path)}
                alt="poster"
              />
              <div className="rating-badge">{formatRating(rating)}</div>
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            <div className="title-section">
              <h1 className="title">{title}</h1>
              <p className="release-date">{formatDate(releaseDate)}</p>
            </div>

            {/* Synopsis */}
            <div className="synopsis-box">
              <h2 className="section-title">Synopsis</h2>
              <p className="synopsis-text">
                {mediaData.overview || 'Overview not available'}
              </p>
            </div>

            {/* Useful Links Section */}
            {(homepage || imdbId) && (
              <div className="useful-links-section">
                <h2 className="section-title">Useful Links</h2>
                <div className="links-container">
                  {homepage && (
                    <a
                      href={homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-button homepage-btn"
                    >
                      <span>🌐</span> Official Website
                    </a>
                  )}
                  {imdbId && (
                    <a
                      href={`https://www.imdb.com/title/${imdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-button imdb-btn"
                    >
                      <span>🎬</span> IMDb Page
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* YouTube Reviews Section */}
      <div className="reviews-wrapper">
        <YTReviews title={title} />
      </div>

      {/* User Reviews Section */}
      <div className="reviews-wrapper">
        <div className="user-review-section">
          <h2 className="section-title">Community Reviews</h2>
          <div className="review-input-container">
            <TextField
              value={reviewText}
              className="review-input"
              label="Type your review here"
              onChange={(e) => setReviewText(e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              placeholder="Share your thoughts..."
              disabled={isPostingReview}
            />
            <Button
              onClick={handlePostReview}
              variant="contained"
              className="post-btn"
              disabled={isPostingReview}
            >
              {isPostingReview ? 'Posting...' : 'Post Review'}
            </Button>
          </div>

          <div className="user-reviews-list">
            <UserReviews key={renderToggle} render={renderToggle} name={title} />
          </div>
        </div>
      </div>
    </div>
  );
};

MediaPage.propTypes = {
  mediaType: PropTypes.oneOf(['movie', 'tv']),
};

MediaPage.defaultProps = {
  mediaType: 'movie',
};

export default MediaPage;
