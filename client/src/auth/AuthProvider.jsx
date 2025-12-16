import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

export default function AuthProvider({ children }) {
  const domain = process.env.REACT_APP_DOMAIN;
  const clientId = process.env.REACT_APP_CLIENT_ID;

  if (!domain || !clientId) {
    // Render children without auth in dev/test if env not present
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {children}
    </Auth0Provider>
  );
}
