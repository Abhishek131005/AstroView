import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RefreshCw, Satellite } from 'lucide-react';
import { getOverheadSatellites } from '@/services/satelliteService';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';

const SATELLITE_CATEGORIES = {
  1: { name: 'ISS', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  2: { name: 'Weather', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  3: { name: 'Communication', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  4: { name: 'Navigation', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  5: { name: 'Science', color: 'text-teal-400', bg: 'bg-teal-400/10' },
  default: { name: 'Other', color: 'text-slate-400', bg: 'bg-slate-400/10' }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Radar className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">Overhead Scan</h3>
        </div>
      </div>

      <div className="mb-6">
        <Button
          onClick={fetchOverheadSatellites}
          disabled={isLoading}
          variant="primary"
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Scanning Sky...</>
          ) : (
            <><Radar className="w-4 h-4" /> Scan for Satellites</>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <p className="text-xs text-rose-400">{error}</p>
        </div>
      )}

      {hasSearched && !isLoading && (
        <>
          {satellites.length === 0 ? (
            <EmptyState
              icon={Satellite} // ✅ FIXED: Passed component reference instead of string
              title="No Satellites Detected"
              message="The orbital paths aren't crossing your region right now. Try scanning again later."
            />
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-xs text-slate-500 mb-2 px-1">
                {satellites.length} objects found in range
              </p>

              {satellites.map((sat, index) => {
                const category = getCategoryInfo(sat.satcategory);
                return (
                  <div
                    key={sat.satid || index}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {sat.satname || 'Orbital Object'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${category.bg} ${category.color}`}>
                            <Satellite className="w-3 h-3" />
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                      <div>
                        Alt: <span className="text-slate-200">{sat.satalt} km</span>
                      </div>
                      <div className="text-right">
                        Lat/Lon: <span className="text-slate-200">{sat.satlat?.toFixed(1)}°, {sat.satlng?.toFixed(1)}°</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}

export { OverheadSatellites };