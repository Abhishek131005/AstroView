import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for API calls with loading, error states, and auto-retry
 * @param {Function} apiFunction - Async function that makes the API call
 * @param {object} options - Options { immediate, retries, retryDelay }
 * @returns {object} { data, loading, error, refetch, reset }
 */
function useApi(apiFunction, options = {}) {
  const {
    immediate = false,
    retries = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeWithRetry = async (params, attemptNumber = 0) => {
    try {
      const result = await apiFunction(params);
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      // If we have retries left and it's a network error, retry
      if (attemptNumber < retries && err.message?.includes('Network')) {
        console.log(`Retry attempt ${attemptNumber + 1} of ${retries}...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attemptNumber + 1)));
        
        return executeWithRetry(params, attemptNumber + 1);
      }

      // No more retries or non-retriable error
      throw err;
    }
  };

  const execute = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await executeWithRetry(params);
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, retries, retryDelay]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Execute immediately on mount if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    reset,
  };
}

export { useApi };
