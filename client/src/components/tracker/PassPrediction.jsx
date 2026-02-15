import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Users, Target, Calendar, RefreshCw, Brain, Loader2 } from 'lucide-react';
import { getSatellitePasses } from '@/services/satelliteService';
import { simplifyText } from '@/services/aiService';
import { CountdownTimer } from '@/components/common/CountdownTimer';
import { Skeleton } from '@/components/common/Skeleton';
import { formatDate } from '@/utils/formatters';

function PassPrediction({ latitude, longitude }) {
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);

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

  const explainNoPasses = async () => {
    setIsSimplifying(true);
    try {
      const prompt = `No ISS passes are visible for the next 10 days at coordinates ${latitude.toFixed(2)}, ${longitude.toFixed(2)}. Explain why this might happen in terms of orbital mechanics and Earth's rotation.`;
      const explanation = await simplifyText(prompt, 'orbital mechanics');
      setAiExplanation(explanation);
    } catch (err) {
      console.error('AI explanation failed:', err);
      setAiExplanation('The ISS orbit is currently not passing over your region during nighttime hours when it would be visible.');
    } finally {
      setIsSimplifying(false);
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
        className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-electric-blue" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">Visible Passes</h3>
        </div>
        <p className="text-sm text-muted-gray">
          Set your location to see upcoming ISS passes.
        </p>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Satellite className="w-12 h-12 text-electric-blue mb-4" />
          </motion.div>
          <p className="text-sm text-slate-400">Calculating orbital trajectories...</p>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-electric-blue" />
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Visible Passes</h3>
          </div>
          <button
            onClick={fetchPasses}
            className="p-2 rounded-lg bg-white/5 hover:bg-electric-blue/20 border border-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-electric-blue" />
          </button>
        </div>
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  const visiblePasses = passes.filter(pass => pass.mag && pass.mag < 2.5).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-electric-blue" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">Next Visible Passes</h3>
        </div>
        <button
          onClick={fetchPasses}
          className="p-2 rounded-lg bg-white/5 hover:bg-electric-blue/20 border border-white/10 hover:border-electric-blue/50 transition-all"
          title="Refresh passes"
        >
          <RefreshCw className="w-4 h-4 text-electric-blue" />
        </button>
      </div>

      {visiblePasses.length === 0 ? (
        <div className="py-6">
          <div className="text-center mb-4">
            <Satellite className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-muted-gray">
              No visible passes in the next 10 days.
            </p>
          </div>
          
          {!aiExplanation && !isSimplifying && (
            <button
              onClick={explainNoPasses}
              className="w-full mt-3 px-4 py-2 bg-gradient-to-br from-electric-blue to-cosmic-purple text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Brain className="w-4 h-4" />
              Why No Passes?
            </button>
          )}
          
          {isSimplifying && (
            <div className="mt-3 flex items-center justify-center gap-2 text-electric-blue">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">AI analyzing orbital patterns...</span>
            </div>
          )}
          
          {aiExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-electric-blue/5 border border-electric-blue/20 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-electric-blue" />
                <span className="text-xs font-bold text-electric-blue uppercase tracking-wide">AI Explained</span>
              </div>
              <p className="text-sm text-star-white leading-relaxed italic">
                {aiExplanation}
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {visiblePasses.map((pass, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-electric-blue/40 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-electric-blue transition-colors mb-1">
                    {formatDate(pass.startUTC, 'MMM d, p')}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-gray">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {pass.duration}s
                    </span>
                    <span>Max: {pass.maxEl}°</span>
                  </div>
                </div>
                {pass.mag && (
                  <div className="text-right bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                    <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wide">Brightness</p>
                    <p className="text-sm font-mono text-amber-300">{pass.mag}</p>
                  </div>
                )}
              </div>

              {pass.startUTC && (
                <div className="mb-3">
                  <CountdownTimer targetDate={pass.startUTC} compact />
                </div>
              )}

              <div className="flex items-center gap-4 text-xs pt-3 border-t border-white/5">
                <div>
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Rise: </span>
                  <span className="text-emerald-400 font-mono">{pass.startAz}°</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Set: </span>
                  <span className="text-rose-400 font-mono">{pass.endAz}°</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-4 text-center uppercase tracking-wide">
        Showing passes brighter than magnitude 2.5
      </p>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 156, 247, 0.2); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}

export { PassPrediction };
