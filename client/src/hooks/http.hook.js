import { useState, useCallback } from 'react';

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true);
    try {
      if (body) {
        // eslint-disable-next-line no-param-reassign
        body = JSON.stringify(body);
        // eslint-disable-next-line no-param-reassign
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, { method, body, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Oops, ssomething goes wrong:(');
      }

      setLoading(false);

      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading, request, error, clearError,
  };
};

export default useHttp;
