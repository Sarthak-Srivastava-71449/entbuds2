import { useState, useEffect, useCallback } from 'react';

export default function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback((...args) => {
    setStatus('pending');
    setValue(null);
    setError(null);
    return asyncFunction(...args)
      .then((response) => {
        setValue(response);
        setStatus('success');
        return response;
      })
      .catch((err) => {
        setError(err);
        setStatus('error');
        throw err;
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (!immediate) return;
    execute();
  }, [execute, immediate]);

  return { execute, status, value, error };
}
