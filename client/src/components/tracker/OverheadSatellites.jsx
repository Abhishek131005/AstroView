import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, RefreshCw, Satellite, Radio } from 'lucide-react';
import { getOverheadSatellites } from '@/services/satelliteService';
import { EmptyState } from '@/components/common/EmptyState';

const SATELLITE_CATEGORIES = {
  1: { name: 'ISS', color: '#22d3ee', dotColor: 'bg-cyan-400' },
  2: { name: 'Weather', color: '#10b981', dotColor: 'bg-emerald-400' },
  3: { name: 'Communication', color: '#a78bfa', dotColor: 'bg-purple-400' },
  4: { name: 'Navigation', color: '#fbbf24', dotColor: 'bg-amber-400' },
  5: { name: 'Science', color: '#14b8a6', dotColor: 'bg-teal-400' },
  default: { name: 'Other', color: '#94a3b8', dotColor: 'bg-slate-400' }
};

// Calculate bearing (azimuth) from observer to satellite
function calculateAzimuth(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
  let azimuth = Math.atan2(y, x) * 180 / Math.PI;
  return (azimuth + 360) % 360; // Normalize to 0-360
}

// Calculate elevation angle (simple approximation based on distance and altitude)
function calculateElevation(observerLat, observerLon, satLat, satLon, satAlt) {
  const R = 6371; // Earth radius in km
  const dLat = (satLat - observerLat) * Math.PI / 180;
  const dLon = (satLon - observerLon) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(observerLat * Math.PI / 180) * Math.cos(satLat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Elevation angle approximation
  const elevation = Math.atan(satAlt / distance) * 180 / Math.PI;
  return Math.max(0, Math.min(90, elevation)); // Clamp 0-90 degrees
}

function OverheadSatellites({ latitude, longitude }) {
  const [satellites, setSatellites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSat, setSelectedSat] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchOverheadSatellites();
      
      // Auto-refresh every 2 minutes
      const interval = setInterval(fetchOverheadSatellites, 120000);
      return () => clearInterval(interval);
    }
  }, [latitude, longitude]);

  const fetchOverheadSatellites = async () => {
    if (!latitude || !longitude) {
      setError('Location required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getOverheadSatellites(latitude, longitude, 90);
      const satellitesWithPosition = (data.above || []).map(sat => {
        const azimuth = calculateAzimuth(latitude, longitude, sat.satlat, sat.satlng);
        const elevation = calculateElevation(latitude, longitude, sat.satlat, sat.satlng, sat.satalt);
        
        return {
          ...sat,
          azimuth,
          elevation
        };
      });
      
      setSatellites(satellitesWithPosition);
    } catch (err) {
      setError(err.message || 'Failed to fetch overhead satellites');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryInfo = (categoryId) => {
    return SATELLITE_CATEGORIES[categoryId] || SATELLITE_CATEGORIES.default;
  };

  // Convert polar coordinates (azimuth, elevation) to Cartesian (x, y) for radar display
  const polarToCartesian = (azimuth, elevation) => {
    const radius = (90 - elevation) / 90; // 0° elevation (horizon) = outer edge, 90° = center
    const angle = (azimuth - 90) * Math.PI / 180; // Rotate so 0° is North (top)
    
    return {
      x: 50 + (radius * 45 * Math.cos(angle)), // 50% center, 45% max radius
      y: 50 + (radius * 45 * Math.sin(angle))
    };
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Radar className="w-16 h-16 text-cyan-400 mb-4" />
          </motion.div>
          <p className="text-sm text-slate-400">Scanning orbital space...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
      >
        <EmptyState
          icon={Satellite}
          title="Radar Offline"
          message={error}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">Sky Radar</h3>
        </div>
        <button
          onClick={fetchOverheadSatellites}
          disabled={isLoading}
          className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {satellites.length === 0 ? (
        <div className="h-96 flex items-center justify-center">
          <EmptyState
            icon={Satellite}
            title="Clear Sky"
            message="No satellites detected in your orbital window. Try again in a few minutes."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Radar Display */}
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Radar Background */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Concentric Circles (Elevation Rings) */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="0.3" />
              
              {/* Cardinal Direction Lines */}
              <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="0.2" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="0.2" />
              <line x1="15" y1="15" x2="85" y2="85" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="0.2" />
              <line x1="85" y1="15" x2="15" y2="85" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="0.2" />
              
              {/* Center Dot (Observer) */}
              <circle cx="50" cy="50" r="1.5" fill="#00E676" opacity="0.8" />
              <circle cx="50" cy="50" r="2.5" fill="none" stroke="#00E676" strokeWidth="0.3" opacity="0.4" />
              
              {/* Satellite Dots */}
              {satellites.map((sat, index) => {
                const pos = polarToCartesian(sat.azimuth, sat.elevation);
                const category = getCategoryInfo(sat.satcategory);
                
                return (
                  <g key={sat.satid || index}>
                    {/* Pulsing Ring Animation */}
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r="2"
                      fill="none"
                      stroke={category.color}
                      strokeWidth="0.3"
                      opacity="0.4"
                    >
                      <animate
                        attributeName="r"
                        from="1"
                        to="4"
                        dur="2s"
                        begin={`${index * 0.2}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="2s"
                        begin={`${index * 0.2}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    
                    {/* Satellite Dot */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="1.2"
                      fill={category.color}
                      className="cursor-pointer hover:r-2 transition-all"
                      onClick={() => setSelectedSat(sat)}
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Cardinal Direction Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
              <span className="text-xs font-bold text-cyan-400">N</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
              <span className="text-xs font-bold text-cyan-400">S</span>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1">
              <span className="text-xs font-bold text-cyan-400">W</span>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
              <span className="text-xs font-bold text-cyan-400">E</span>
            </div>
            
            {/* Elevation Labels */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-[8px] text-slate-500 font-mono">90°</span>
            </div>
          </div>

          {/* Satellite Count */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              <span className="text-2xl font-bold text-cyan-400">{satellites.length}</span> objects in range
            </p>
          </div>

          {/* Selected Satellite Details */}
          {selectedSat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/5 rounded-2xl border border-cyan-500/30"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-white text-sm">{selectedSat.satname}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-2 ${getCategoryInfo(selectedSat.satcategory).dotColor} bg-opacity-20`}>
                    <Satellite className="w-3 h-3" />
                    {getCategoryInfo(selectedSat.satcategory).name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSat(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500 uppercase font-bold text-[10px]">Azimuth</p>
                  <p className="text-white font-mono">{selectedSat.azimuth.toFixed(1)}°</p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase font-bold text-[10px]">Elevation</p>
                  <p className="text-white font-mono">{selectedSat.elevation.toFixed(1)}°</p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase font-bold text-[10px]">Altitude</p>
                  <p className="text-white font-mono">{selectedSat.satalt} km</p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase font-bold text-[10px]">Position</p>
                  <p className="text-white font-mono text-[10px]">{selectedSat.satlat?.toFixed(1)}°, {selectedSat.satlng?.toFixed(1)}°</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Satellite List (Compact) */}
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {satellites.map((sat, index) => {
              const category = getCategoryInfo(sat.satcategory);
              return (
                <button
                  key={sat.satid || index}
                  onClick={() => setSelectedSat(sat)}
                  className={`w-full p-3 rounded-xl border transition-all text-left ${
                    selectedSat?.satid === sat.satid
                      ? 'bg-cyan-500/10 border-cyan-500/50'
                      : 'bg-white/5 border-white/5 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${category.dotColor}`} />
                      <span className="text-xs font-bold text-white">{sat.satname}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {sat.azimuth.toFixed(0)}° / {sat.elevation.toFixed(0)}°
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
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