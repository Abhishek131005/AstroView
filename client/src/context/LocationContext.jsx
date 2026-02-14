import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLocation as useGeolocation } from '@/hooks/useLocation';
import { STORAGE_KEYS, DEFAULT_LOCATION } from '@/utils/constants';

const LocationContext = createContext();

function LocationProvider({ children }) {
  const [savedLocation, setSavedLocation] = useLocalStorage(
    STORAGE_KEYS.USER_LOCATION,
    DEFAULT_LOCATION
  );

  const [location, setLocation] = useState(savedLocation);
  const [locationName, setLocationName] = useState(savedLocation.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { 
    location: geoLocation, 
    loading: geoLoading, 
    error: geoError, 
    getLocation,
    clearError: clearGeoError,
  } = useGeolocation();

  // Auto-detect location using browser geolocation
  const autoDetect = useCallback(() => {
    setIsLoading(true);
    setError(null);
    getLocation();
  }, [getLocation]);

  // Update location state when geolocation succeeds
  useEffect(() => {
    if (geoLocation && !geoLoading) {
      const newLocation = {
        lat: geoLocation.lat,
        lon: geoLocation.lon,
        name: 'Current Location',
      };
      
      setLocation(newLocation);
      setSavedLocation(newLocation);
      setLocationName('Current Location');
      setIsLoading(false);
    }
  }, [geoLocation, geoLoading, setSavedLocation]);

  // Handle geolocation error
  useEffect(() => {
    if (geoError) {
      setError(geoError.message);
      setIsLoading(false);
    }
  }, [geoError]);

  // Manually set location (e.g., from search or selection)
  const setUserLocation = useCallback((lat, lon, name = '') => {
    const newLocation = { lat, lon, name };
    setLocation(newLocation);
    setSavedLocation(newLocation);
    setLocationName(name);
    setError(null);
  }, [setSavedLocation]);

  // Clear location and revert to default
  const clearLocation = useCallback(() => {
    setLocation(DEFAULT_LOCATION);
    setSavedLocation(DEFAULT_LOCATION);
    setLocationName(DEFAULT_LOCATION.name);
    setError(null);
    clearGeoError();
  }, [setSavedLocation, clearGeoError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    clearGeoError();
  }, [clearGeoError]);

  const value = {
    location,
    locationName,
    isLoading: isLoading || geoLoading,
    error,
    setLocation: setUserLocation,
    autoDetect,
    clearLocation,
    clearError,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook to use location context
function useLocationContext() {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  
  return context;
}

export { LocationProvider, useLocationContext };
