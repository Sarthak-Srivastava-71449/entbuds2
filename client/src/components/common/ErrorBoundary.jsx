import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real app, send to monitoring service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'normal' }}>{String(this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
