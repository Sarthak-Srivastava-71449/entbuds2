import React from 'react';
import { useParams } from 'react-router-dom';
import genres from '../../config/genres';
import MediaList from './MediaList';

export default function GenrePage() {
  const { genre } = useParams();
  const conf = genres[genre];
  if (!conf) return <div style={{ padding: 24, color: 'white' }}>Unknown genre</div>;
  return <MediaList mediaType={conf.mediaType} genreId={conf.genreId} title={conf.title} />;
}
