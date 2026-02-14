import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, Ruler, TrendingDown, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { getNearEarthObjects } from '@/services/nasaService';
import { Skeleton } from '@/components/common/Skeleton';
import { Badge } from '@/components/common/Badge';
import { formatDate, formatDistance } from '@/utils/formatters';

function NEOSection() {
  const [neoData, setNeoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNEOs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get NEOs for next 7 days
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 7);

      const formatDateString = (date) => {
        return date.toISOString().split('T')[0];
      };

      const data = await getNearEarthObjects(formatDateString(today), formatDateString(endDate));
      
      // Parse and flatten the NEO data
      const objects = [];
      Object.keys(data.near_earth_objects || {}).forEach(date => {
        data.near_earth_objects[date].forEach(neo => {
          objects.push({
            id: neo.id,
            name: neo.name,
            date: date,
            estimatedDiameter: neo.estimated_diameter?.meters?.estimated_diameter_max || 0,
            closeApproach: neo.close_approach_data?.[0],
            isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
            velocity: parseFloat(neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0),
            missDistance: parseFloat(neo.close_approach_data?.[0]?.miss_distance?.kilometers || 0)
          });
        });
      });

      // Sort by approach date
      objects.sort((a, b) => new Date(a.date) - new Date(b.date));

      setNeoData(objects.slice(0, 10)); // Show top 10
    } catch (err) {
      setError(err.message || 'Failed to fetch near-Earth objects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNEOs();
  }, []);

  const getSizeCategory = (diameter) => {
    if (diameter < 50) return { label: 'Small', icon: '🌑', color: 'text-green-400' };
    if (diameter < 200) return { label: 'Medium', icon: '🌕', color: 'text-amber-400' };
    return { label: 'Large', icon: '🌍', color: 'text-red-400' };
  };

  const getSafetyIndicator = (isPotentiallyHazardous, missDistance) => {
    if (isPotentiallyHazardous && missDistance < 7500000) {
      return { variant: 'planned', label: 'Monitor', icon: AlertCircle };
    }
    return { variant: 'completed', label: 'Safe', icon: Shield };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-bg-secondary border border-white/10 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Near-Earth Objects</h3>
          <button
            onClick={fetchNEOs}
            className="text-muted-gray hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Near-Earth Asteroids</h3>
          <p className="text-sm text-muted-gray">
            Close approaches in the next 7 days
          </p>
        </div>
        <button
          onClick={fetchNEOs}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          title="Refresh data"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 text-muted-gray ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {neoData.length === 0 ? (
        <div className="p-8 bg-bg-secondary border border-white/10 rounded-xl text-center">
          <p className="text-muted-gray">No close approaches in the next 7 days</p>
        </div>
      ) : (
        <div className="space-y-3">
          {neoData.map(neo => {
            const sizeInfo = getSizeCategory(neo.estimatedDiameter);
            const safetyInfo = getSafetyIndicator(neo.isPotentiallyHazardous, neo.missDistance);
            const SafetyIcon = safetyInfo.icon;

            return (
              <motion.div
                key={neo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-bg-secondary border border-white/10 rounded-xl p-4 hover:border-electric-blue/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{neo.name}</h4>
                    <p className="text-sm text-muted-gray">
                      Asteroid ID: {neo.id}
                    </p>
                  </div>
                  <Badge variant={safetyInfo.variant}>
                    <SafetyIcon className="w-3 h-3" />
                    {safetyInfo.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-gray" />
                      <span className="text-xs text-muted-gray">Approach Date</span>
                    </div>
                    <p className="text-white font-medium">{formatDate(neo.date, 'MMM d')}</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Ruler className="w-3.5 h-3.5 text-muted-gray" />
                      <span className="text-xs text-muted-gray">Diameter</span>
                    </div>
                    <p className={`font-medium ${sizeInfo.color}`}>
                      {sizeInfo.icon} {Math.round(neo.estimatedDiameter)}m
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-3.5 h-3.5 text-muted-gray" />
                      <span className="text-xs text-muted-gray">Miss Distance</span>
                    </div>
                    <p className="text-white font-medium font-mono text-xs">
                      {formatDistance(neo.missDistance)}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Rocket className="w-3.5 h-3.5 text-muted-gray" />
                      <span className="text-xs text-muted-gray">Velocity</span>
                    </div>
                    <p className="text-white font-medium font-mono text-xs">
                      {Math.round(neo.velocity).toLocaleString()} km/h
                    </p>
                  </div>
                </div>

                {neo.isPotentiallyHazardous && (
                  <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-400">
                      ⚠️ Classified as potentially hazardous due to size and orbit proximity
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="p-4 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
        <p className="text-sm text-gray-200">
          💡 <strong>Did you know?</strong> NASA tracks over 30,000 near-Earth asteroids. 
          None currently pose a threat to Earth, but continuous monitoring helps us prepare for potential impacts decades in advance.
        </p>
      </div>
    </motion.div>
  );
}

export { NEOSection };
