import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Users, Target, Calendar, RefreshCw } from 'lucide-react';
import { getSatellitePasses } from '@/services/satelliteService';
import { CountdownTimer } from '@/components/common/CountdownTimer';
import { Skeleton } from '@/components/common/Skeleton';
import { formatDate } from '@/utils/formatters';

function PassPrediction({ latitude, longitude }) {
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ISS_NORAD_ID = 25544;

  const fetchPasses = async () => {
    if (!latitude || !longitude) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getSatellitePasses(ISS_NORAD_ID, latitude, longitude, 10);
      setPasses(data.passes || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch pass predictions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary border border-white/10 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-electric-blue" />
          <h3 className="font-semibold text-white">Visible Passes</h3>
        </div>
        <p className="text-sm text-muted-gray">
          Set your location on the Home page to see upcoming ISS passes.
        </p>
      </motion.div>
    );
  }

  if (isLoading) {
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
            <Calendar className="w-5 h-5 text-electric-blue" />
            <h3 className="font-semibold text-white">Visible Passes</h3>
          </div>
          <button
            onClick={fetchPasses}
            className="text-muted-gray hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  const visiblePasses = passes.filter(pass => pass.mag && pass.mag < 2.5).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-electric-blue" />
          <h3 className="font-semibold text-white">Next Visible Passes</h3>
        </div>
        <button
          onClick={fetchPasses}
          className="text-muted-gray hover:text-white transition-colors"
          title="Refresh passes"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {visiblePasses.length === 0 ? (
        <p className="text-sm text-muted-gray text-center py-4">
          No visible passes in the next 10 days.
        </p>
      ) : (
        <div className="space-y-3">
          {visiblePasses.map((pass, index) => (
            <div
              key={index}
              className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-electric-blue/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-white mb-1">
                    {formatDate(pass.startUTC, 'MMM d, p')}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-gray">
                    <span>Duration: {pass.duration}s</span>
                    <span>Max Elev: {pass.maxEl}°</span>
                  </div>
                </div>
                {pass.mag && (
                  <div className="text-right">
                    <p className="text-xs text-muted-gray">Magnitude</p>
                    <p className="text-sm font-mono text-amber-400">{pass.mag}</p>
                  </div>
                )}
              </div>

              {pass.startUTC && (
                <div className="mt-2">
                  <CountdownTimer targetDate={pass.startUTC} compact />
                </div>
              )}

              <div className="mt-2 flex items-center gap-4 text-xs">
                <div>
                  <span className="text-muted-gray">Rise: </span>
                  <span className="text-white font-mono">{pass.startAz}°</span>
                </div>
                <div>
                  <span className="text-muted-gray">Set: </span>
                  <span className="text-white font-mono">{pass.endAz}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-gray mt-4 text-center">
        Showing passes brighter than magnitude 2.5
      </p>
    </motion.div>
  );
}

export { PassPrediction };
