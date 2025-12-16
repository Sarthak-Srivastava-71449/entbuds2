import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
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

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${title}moviereview&type=video&key=${
            process.env.REACT_APP_API_KEY2
          }`
        );

        if (isMounted && response.data && response.data.items) {
          setReviews(response.data.items);
        }
      } catch (err) {
        console.error('Error fetching YouTube reviews:', err);
        if (isMounted) {
          setError(err.message || ERROR_MESSAGES.FETCH_ERROR);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReviews();

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
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
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
