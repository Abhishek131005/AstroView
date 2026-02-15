// client/src/pages/TrackerPage.jsx
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Satellite, MapPin, Loader2 } from 'lucide-react'; // Added Loader2
import { LocationContext } from '@/context/LocationContext';
import { ISSMap } from '@/components/tracker/ISSMap';
import { SatelliteInfo } from '@/components/tracker/SatelliteInfo';
import { PassPrediction } from '@/components/tracker/PassPrediction';
import { OverheadSatellites } from '@/components/tracker/OverheadSatellites';

function TrackerPage() {
  const { location, isLoading: isLocationLoading } = useContext(LocationContext);

  // 1. Check if the Context itself is still fetching the user's coordinates
  if (isLocationLoading || !location || !location.lat) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
        </div>
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">
          Acquiring Ground Station...
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Please ensure location access is granted in your browser.
        </p>
      </div>
    );
  }

  // 2. Only render components once we have valid [lat, lon]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-10"
    >
      <div className="flex items-center gap-3">
        <Satellite className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Live Sky Tracker
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time orbital tracking for <span className="text-cyan-400">{location.name || 'your location'}</span>
          </p>
        </div>
      </div>

      <section className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
        <ISSMap userLocation={location} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SatelliteInfo />
        </div>

        <div className="lg:col-span-1">
          <PassPrediction 
            latitude={location.lat} 
            longitude={location.lon} 
          />
        </div>

        <div className="lg:col-span-1">
          <OverheadSatellites 
            latitude={location.lat} 
            longitude={location.lon} 
          />
        </div>
      </section>
    </motion.div>
  );
}

export { TrackerPage };