import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { fetchYouTubeReviews } from '../../../services/backendService';
import { getErrorMessage, getYouTubeEmbedUrl } from '../../../utils/apiHelpers';
import { ERROR_MESSAGES } from '../../../config/constants';
import './YTReviews.css';

/**
 * YTReviews component
 * Displays YouTube reviews/trailers for a movie or TV show
 */
const YTReviews = ({ title }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch YouTube reviews for the given title
   */
  useEffect(() => {
    if (!title) return;

    let isMounted = true;

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchYouTubeReviews(title, 10);

        if (isMounted && data && data.items) {
          setReviews(data.items);
        }
      } catch (err) {
        console.error('Error fetching YouTube reviews:', err);
        if (isMounted) {
          setError(getErrorMessage(err) || ERROR_MESSAGES.FETCH_ERROR);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [title]);

  if (isLoading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '2em' }}>Loading reviews...</div>;
  }

  if (error) {
    return (
      <div style={{ color: '#d32f2f', textAlign: 'center', padding: '2em' }}>
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '2em' }}>No reviews found</div>;
  }

  return (
    <div className="ytrevs">
      <h1 id="ythead">Youtube Reviews</h1>

      <Carousel
        showThumbs={false}
        autoPlay={false}
        transitionTime={2100}
        infiniteLoop={true}
        showStatus={false}
      >
        {reviews.map((video) => (
          <div key={video.id.videoId} className="revvid">
            <iframe
              src={getYouTubeEmbedUrl(video.id.videoId)}
              className="ytvideo"
              title={video.snippet.title}
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

YTReviews.propTypes = {
  title: PropTypes.string.isRequired,
};

export default YTReviews;
