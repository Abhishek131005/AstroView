import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RefreshCw, Satellite } from 'lucide-react';
import { getOverheadSatellites } from '@/services/satelliteService';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';

const SATELLITE_CATEGORIES = {
  1: { name: 'ISS', color: 'text-electric-blue', bg: 'bg-electric-blue/10' },
  2: { name: 'Weather', color: 'text-green-400', bg: 'bg-green-400/10' },
  3: { name: 'Communication', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  4: { name: 'Navigation', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  5: { name: 'Science', color: 'text-teal-400', bg: 'bg-teal-400/10' },
  default: { name: 'Other', color: 'text-gray-400', bg: 'bg-gray-400/10' }
};

function OverheadSatellites({ latitude, longitude }) {
  const [satellites, setSatellites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchOverheadSatellites = async () => {
    if (!latitude || !longitude) {
      setError('Location required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await getOverheadSatellites(latitude, longitude, 90);
      setSatellites(data.above || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch overhead satellites');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryInfo = (categoryId) => {
    return SATELLITE_CATEGORIES[categoryId] || SATELLITE_CATEGORIES.default;
  };

  if (!latitude || !longitude) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Radar className="w-5 h-5 text-electric-blue" />
          <h3 className="font-semibold text-white">What's Above Me</h3>
        </div>
        <p className="text-sm text-muted-gray">
          Set your location on the Home page to see satellites overhead.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radar className="w-5 h-5 text-electric-blue" />
          <h3 className="font-semibold text-white">What's Above Me</h3>
        </div>
      </div>

      <div className="mb-4">
        <Button
          onClick={fetchOverheadSatellites}
          disabled={isLoading}
          variant="primary"
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Radar className="w-4 h-4" />
              Scan for Satellites
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {hasSearched && !isLoading && (
        <>
          {satellites.length === 0 ? (
            <EmptyState
              icon="satellite"
              message="No satellites overhead"
              description="Try scanning again in a few moments."
            />
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm text-muted-gray">
                  {satellites.length} satellite{satellites.length !== 1 ? 's' : ''} detected
                </span>
              </div>

              {satellites.map((sat, index) => {
                const category = getCategoryInfo(sat.satcategory);
                return (
                  <div
                    key={sat.satid || index}
                    className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-electric-blue/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {sat.satname || 'Unknown Satellite'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${category.bg} ${category.color}`}>
                            <Satellite className="w-3 h-3" />
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {sat.satalt && (
                        <div>
                          <span className="text-muted-gray">Altitude: </span>
                          <span className="text-white font-mono">{sat.satalt} km</span>
                        </div>
                      )}
                      {sat.satlat && sat.satlng && (
                        <div>
                          <span className="text-muted-gray">Position: </span>
                          <span className="text-white font-mono">
                            {sat.satlat.toFixed(2)}°, {sat.satlng.toFixed(2)}°
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-muted-gray mt-4 text-center">
            Auto-refreshing every 30 seconds
          </p>
        </>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 217, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 217, 255, 0.5);
        }
      `}</style>
    </motion.div>
  );
}

export { OverheadSatellites };
