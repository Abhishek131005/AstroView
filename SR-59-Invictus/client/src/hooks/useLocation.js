import { useState, useCallback } from 'react';
import { isGeolocationAvailable } from '@/utils/helpers';

/**
 * Custom hook for Geolocation API
 * @returns {object} { location, loading, error, getLocation, clearError }
 */
function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getLocation = useCallback((options = {}) => {
    const {
      enableHighAccuracy = true,
      timeout = 10000,
      maximumAge = 0,
    } = options;

    // Check if geolocation is available
    if (!isGeolocationAvailable()) {
      setError({
        code: 'UNAVAILABLE',
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    setLoading(true);
    setError(null);

    const geolocationOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    const handleSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
      setLoading(false);
    };

    const handleError = (error) => {
      let errorMessage = 'Failed to get your location';
      let errorCode = 'UNKNOWN';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Please enable location access.';
          errorCode = 'PERMISSION_DENIED';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          errorCode = 'POSITION_UNAVAILABLE';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          errorCode = 'TIMEOUT';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      setError({
        code: errorCode,
        message: errorMessage,
      });
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geolocationOptions
    );
  }, []);

  return {
    location,
    loading,
    error,
    getLocation,
    clearError,
  };
}

export { useLocation };
