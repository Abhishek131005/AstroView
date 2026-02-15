import { useContext, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Navigation, Edit3, Check, Map } from 'lucide-react';
import { LocationContext } from '@/context/LocationContext';
import { Button } from '@/components/common/Button';
import { formatCoordinates } from '@/utils/formatters';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map click handler component
function LocationSelector({ onLocationSelect, selectedPosition }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });

  return selectedPosition ? (
    <Marker position={[selectedPosition.lat, selectedPosition.lng]} />
  ) : null;
}

function LocationPicker() {
  const { location, isLoading, error, setLocation, autoDetect } = useContext(LocationContext);
  const [isEditing, setIsEditing] = useState(false);
  const [useMapMode, setUseMapMode] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [manualName, setManualName] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Reverse geocode coordinates to get location name
  const reverseGeocode = async (lat, lon) => {
    try {
      setIsGeocoding(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const { city, town, village, state, country } = data.address;
        const locationName = city || town || village || state || country || 'Unknown Location';
        return locationName;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Forward geocode location name to get coordinates
  const forwardGeocode = async (locationName) => {
    try {
      setIsGeocoding(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          name: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Forward geocoding error:', error);
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Auto-detect location on first mount if not set
  useEffect(() => {
    if (!location.lat && !isLoading && !error) {
      autoDetect();
    }
  }, []);

  const handleAutoDetect = async () => {
    await autoDetect();
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    // If location name is provided, try to geocode it first
    if (manualName.trim() && !manualLat && !manualLon) {
      const geocoded = await forwardGeocode(manualName.trim());
      if (geocoded) {
        setLocation(geocoded.lat, geocoded.lon, geocoded.name);
        setIsEditing(false);
        setUseMapMode(false);
        setMapPosition(null);
        setManualLat('');
        setManualLon('');
        setManualName('');
        return;
      } else {
        alert('Location not found. Please enter coordinates manually.');
        return;
      }
    }
    
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert('Please enter valid coordinates (Lat: -90 to 90, Lon: -180 to 180)');
      return;
    }

    // Reverse geocode to get location name if not provided
    let finalName = manualName.trim();
    if (!finalName) {
      const geocodedName = await reverseGeocode(lat, lon);
      finalName = geocodedName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }

    setLocation(lat, lon, finalName);
    setIsEditing(false);
    setUseMapMode(false);
    setMapPosition(null);
    setManualLat('');
    setManualLon('');
    setManualName('');
  };

  const handleMapLocationSelect = async (latlng) => {
    setMapPosition(latlng);
    setManualLat(latlng.lat.toFixed(4));
    setManualLon(latlng.lng.toFixed(4));
    
    // Auto-reverse geocode when clicking on map
    const geocodedName = await reverseGeocode(latlng.lat, latlng.lng);
    if (geocodedName) {
      setManualName(geocodedName);
    }
  };

  const handleMapSubmit = async () => {
    if (mapPosition) {
      let finalName = manualName.trim();
      if (!finalName) {
        const geocodedName = await reverseGeocode(mapPosition.lat, mapPosition.lng);
        finalName = geocodedName || `${mapPosition.lat.toFixed(2)}, ${mapPosition.lng.toFixed(2)}`;
      }
      
      setLocation(
        mapPosition.lat, 
        mapPosition.lng, 
        finalName
      );
      setIsEditing(false);
      setUseMapMode(false);
      setMapPosition(null);
      setManualName('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-electric-blue" />
          <h3 className="font-semibold text-white">Your Location</h3>
        </div>
        
        {location.lat && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-muted-gray hover:text-white transition-colors flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Change
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {!location.lat && !isEditing ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-gray">
            Set your location to get personalized sky viewing recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleAutoDetect}
              disabled={isLoading}
              variant="primary"
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Auto-Detect Location
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setIsEditing(true)}
              variant="secondary"
              className="flex-1"
            >
              Enter Manually
            </Button>
          </div>
        </div>
      ) : isEditing ? (
        <div className="space-y-3">
          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-bg-tertiary rounded-lg">
            <button
              onClick={() => setUseMapMode(false)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                !useMapMode 
                  ? 'bg-electric-blue text-white' 
                  : 'text-muted-gray hover:text-white'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setUseMapMode(true)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                useMapMode 
                  ? 'bg-electric-blue text-white' 
                  : 'text-muted-gray hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              Map View
            </button>
          </div>

          {useMapMode ? (
            /* Map Mode */
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-muted-gray mb-1">
                  Location Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g., New York, Paris, Mumbai (or click on map)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-muted-gray focus:outline-none focus:border-electric-blue/50 transition-colors"
                  />
                  {isGeocoding && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-electric-blue" />
                  )}
                </div>
                <p className="text-xs text-muted-gray mt-1">
                  Auto-filled when you click on the map
                </p>
              </div>

              <div className="h-[300px] rounded-lg overflow-hidden border border-white/10">
                <MapContainer
                  center={location.lat ? [location.lat, location.lon] : [20, 0]}
                  zoom={location.lat ? 6 : 2}
                  className="h-full w-full"
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                  />
                  <LocationSelector 
                    onLocationSelect={handleMapLocationSelect}
                    selectedPosition={mapPosition}
                  />
                </MapContainer>
              </div>

              {mapPosition && (
                <div className="p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
                  <p className="text-sm text-white">
                    Selected: {mapPosition.lat.toFixed(4)}°, {mapPosition.lng.toFixed(4)}°
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleMapSubmit} 
                  variant="primary" 
                  className="flex-1"
                  disabled={!mapPosition}
                >
                  Save Location
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setUseMapMode(false);
                    setMapPosition(null);
                    setManualName('');
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* Manual Entry Mode */
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-muted-gray mb-1">
                  Location Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g., New York, Paris, Mumbai"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-muted-gray focus:outline-none focus:border-electric-blue/50 transition-colors"
                  />
                  {isGeocoding && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-electric-blue" />
                  )}
                </div>
                <p className="text-xs text-muted-gray mt-1">
                  Enter a city name to auto-detect coordinates
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-muted-gray mb-1">
                    Latitude (optional if name provided)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    placeholder="e.g., 40.7128"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-muted-gray focus:outline-none focus:border-electric-blue/50 transition-colors font-mono text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-gray mb-1">
                    Longitude (optional if name provided)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLon}
                    onChange={(e) => setManualLon(e.target.value)}
                    placeholder="e.g., -74.0060"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-muted-gray focus:outline-none focus:border-electric-blue/50 transition-colors font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="flex-1">
                  Save Location
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setManualLat('');
                    setManualLon('');
                    setManualName('');
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-electric-blue/5 to-cosmic-purple/5 border border-electric-blue/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MapPin className="w-5 h-5 text-electric-blue" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-aurora-green rounded-full animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-white">{location.name || 'Unknown Location'}</p>
                <p className="text-xs text-muted-gray font-mono">
                  {formatCoordinates(location.lat, location.lon)}
                </p>
              </div>
            </div>
            <Check className="w-5 h-5 text-aurora-green" />
          </div>
          
          {/* Interactive Mini Map */}
          <div className="relative h-48 rounded-lg overflow-hidden border border-white/10">
            <MapContainer
              center={[location.lat, location.lon]}
              zoom={10}
              className="h-full w-full"
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />
              <Marker position={[location.lat, location.lon]} />
            </MapContainer>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-xs text-white">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-electric-blue" />
                {location.name || 'Your Location'}
              </span>
              <span className="font-mono">{location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export { LocationPicker };
