import React, { useEffect, useState } from 'react';
import './MediaPage.css';
import { useParams } from 'react-router-dom';
import { api } from '../../../api';
import endpoints from '../../../api/Wanted';
import YTReviews from '../YTReviews/YTReviews';
import UserReviews from '../UserReviews/UserReviews';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, TextField } from '@mui/material';

export default function MediaPage({ mediaType = 'movie' }) {
  const { id } = useParams();
  const { user } = useAuth0();
  const [data, setData] = useState(null);
  const [renderToggle, setRenderToggle] = useState(true);
  const [review, setReview] = useState('');

  useEffect(() => {
    let mounted = true;
    const descriptor = mediaType === 'movie' ? endpoints.movieDetails(id, { language: 'en-US' }) : endpoints.tvDetails(id, { language: 'en-US' });
    api.get(descriptor.url, { params: descriptor.params })
      .then((res) => { if (mounted) setData(res.data); })
      .catch(() => {});
    window.scrollTo(0, 0);
    return () => { mounted = false; };
  }, [id, mediaType]);

  const title = data ? (mediaType === 'movie' ? data.original_title : data.original_name) : '';
  const poster = data ? (data.poster_path || '') : '';
  const backdrop = data ? (data.backdrop_path || '') : '';
  const rating = data ? data.vote_average : '';
  const date = data ? (mediaType === 'movie' ? data.release_date : data.first_air_date) : '';

  const handlePostReview = async () => {
    if (!review) return alert('Please fill the field');
    try {
      const checkResp = await fetch(`${process.env.REACT_APP_DATABASE}/api/review/${encodeURIComponent(title)}`);
      const check = await checkResp.json();

      const body = JSON.stringify({ title, reviews: { review, name: user?.name, image: user?.picture } });
      if (!check.exist) {
        const resp = await fetch(`${process.env.REACT_APP_DATABASE}/api/review`, { method: 'POST', headers: { 'Content-type': 'application/json' }, body });
        if (!resp.ok) throw new Error('Failed to post review');
      } else {
        const resp = await fetch(`${process.env.REACT_APP_DATABASE}/api/review`, { method: 'PUT', headers: { 'Content-type': 'application/json' }, body });
        if (!resp.ok) throw new Error('Failed to update review');
      }
      setRenderToggle(!renderToggle);
      setReview('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="chosen">
      <div className="introduction">
        <img className="bg" src={`https://image.tmdb.org/t/p/original${backdrop || ''}`} alt="bg" />
      </div>

      <div className="thumbbox">
        <div className="thumbnail">
          <img className="poster" src={`https://image.tmdb.org/t/p/original${poster || ''}`} alt="poster" />
        </div>
        <div className="head-data">
          <div className="poster-name-rating text-styling">
            <h1>{title || 'Title'}</h1>
            <h1>{rating || '—'}</h1>
          </div>
          <div className="date text-styling">
            <h1>Release date: <span style={{ color: 'white' }}>{date || '—'}</span></h1>
          </div>
          <div className="description">
            <h1>Synopsis:</h1>
            <p>{data?.overview || 'Overview here'}</p>
          </div>
        </div>
      </div>

      {data && (
        <YTReviews title={title} className="ytrevs" />
      )}

      <div className="inputs">
        <div className="review-section">
          <h2>Reviews</h2>
          <div className="review-container">
            <TextField value={review} className="review" label="Type your review here" onChange={(e) => setReview(e.target.value)} />
            <Button onClick={handlePostReview} variant="contained" size="small" style={{ fontSize: '1.2rem', background: 'red', color: 'black', display: 'flex', alignItems: 'center', height: '2.8em' }}>Post</Button>
          </div>

          {data && (
            <div className="userrevs">
              <UserReviews key={renderToggle} render={renderToggle} name={title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
