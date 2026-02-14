import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Eye, Thermometer, RefreshCw, CloudOff, Sun, CloudRain } from 'lucide-react';
import { LocationContext } from '@/context/LocationContext';
import { getSkyConditions } from '@/services/weatherService';
import { Skeleton } from '@/components/common/Skeleton';
import { Badge } from '@/components/common/Badge';

function SkyConditions() {
  const { location } = useContext(LocationContext);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchWeather = async () => {
    if (!location.lat || !location.lon) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getSkyConditions(location.lat, location.lon);
      setWeather(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location.lat, location.lon]);

  const getVisibilityRating = (cloudCover) => {
    if (cloudCover <= 20) return { rating: 'Excellent', variant: 'active', icon: Sun };
    if (cloudCover <= 50) return { rating: 'Good', variant: 'completed', icon: CloudOff };
    if (cloudCover <= 75) return { rating: 'Fair', variant: 'planned', icon: Cloud };
    return { rating: 'Poor', variant: 'default', icon: CloudRain };
  };

  const getBestViewingTime = (cloudCover) => {
    if (cloudCover <= 30) return 'Excellent viewing conditions all night';
    if (cloudCover <= 60) return 'Best viewing after 10 PM when clouds may clear';
    return 'Check back tomorrow for better conditions';
  };

  if (!location.lat) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="w-5 h-5 text-electric-blue" />
          <h3 className="font-semibold text-white">Sky Conditions</h3>
        </div>
        <p className="text-sm text-muted-gray">
          Set your location to view sky conditions.
        </p>
      </motion.div>
    );
  }

  if (isLoading && !weather) {
    return (
      <div className="bg-bg-secondary border border-white/10 rounded-xl p-5">
        <Skeleton variant="card" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-electric-blue" />
            <h3 className="font-semibold text-white">Sky Conditions</h3>
          </div>
          <button
            onClick={fetchWeather}
            className="text-muted-gray hover:text-white transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!weather) return null;

  const visibilityInfo = getVisibilityRating(weather.cloudCover);
  const VisibilityIcon = visibilityInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary border border-white/10 rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-electric-blue" />
          <h3 className="font-semibold text-white">Sky Conditions</h3>
        </div>
        <button
          onClick={fetchWeather}
          className="text-muted-gray hover:text-white transition-colors disabled:opacity-50"
          disabled={isLoading}
          title="Refresh weather data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Visibility Rating */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-gray">Viewing Conditions</span>
          <Badge variant={visibilityInfo.variant}>
            <VisibilityIcon className="w-3 h-3" />
            {visibilityInfo.rating}
          </Badge>
        </div>
      </div>

      {/* Weather Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="w-4 h-4 text-muted-gray" />
            <span className="text-xs text-muted-gray">Cloud Cover</span>
          </div>
          <p className="text-2xl font-bold text-white">{weather.cloudCover}%</p>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-muted-gray" />
            <span className="text-xs text-muted-gray">Visibility</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}
          </p>
        </div>

        {weather.temperature && (
          <div className="bg-white/5 rounded-lg p-3 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4 text-muted-gray" />
              <span className="text-xs text-muted-gray">Temperature</span>
            </div>
            <p className="text-2xl font-bold text-white">{Math.round(weather.temperature)}°C</p>
          </div>
        )}
      </div>

      {/* Best Viewing Time */}
      <div className="p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
        <p className="text-sm text-gray-200">
          💡 {getBestViewingTime(weather.cloudCover)}
        </p>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <p className="text-xs text-muted-gray mt-3 text-center">
          Updated {lastUpdate.toLocaleTimeString()}
        </p>
      )}
    </motion.div>
  );
}

export { SkyConditions };
