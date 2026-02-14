import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Navigation, Edit3 } from 'lucide-react';
import { LocationContext } from '@/context/LocationContext';
import Button from '@/components/common/Button';

function LocationPicker() {
  const { location, isLoading, error, setLocation, autoDetect } = useContext(LocationContext);
  const [isEditing, setIsEditing] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [manualName, setManualName] = useState('');

  const handleAutoDetect = async () => {
    await autoDetect();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert('Please enter valid coordinates (Lat: -90 to 90, Lon: -180 to 180)');
      return;
    }

    setLocation(lat, lon, manualName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`);
    setIsEditing(false);
    setManualLat('');
    setManualLon('');
    setManualName('');
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
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-muted-gray mb-1">
              Location Name (optional)
            </label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="e.g., New York, Paris, etc."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-muted-gray focus:outline-none focus:border-electric-blue/50 transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-muted-gray mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="e.g., 40.7128"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-muted-gray focus:outline-none focus:border-electric-blue/50 transition-colors font-mono text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-muted-gray mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                placeholder="e.g., -74.0060"
                required
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
      ) : (
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div>
            <p className="font-medium text-white">{location.locationName}</p>
            <p className="text-sm text-muted-gray font-mono">
              {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
            </p>
          </div>
          <MapPin className="w-5 h-5 text-electric-blue" />
        </div>
      )}
    </motion.div>
  );
}

export { LocationPicker };
