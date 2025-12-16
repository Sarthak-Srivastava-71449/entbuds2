import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

export default function LoadingFallback({ size = 80, color = '#e53935' }) {
  return (
    <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
      <BounceLoader size={size} color={color} />
    </div>
  );
}
