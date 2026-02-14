import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Satellite } from 'lucide-react';
import { LocationContext } from '@/context/LocationContext';
import { ISSMap } from '@/components/tracker/ISSMap';
import { SatelliteInfo } from '@/components/tracker/SatelliteInfo';
import { PassPrediction } from '@/components/tracker/PassPrediction';
import { OverheadSatellites } from '@/components/tracker/OverheadSatellites';

function TrackerPage() {
  const { location } = useContext(LocationContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Satellite className="w-8 h-8 text-electric-blue" />
        <div>
          <h1 className="text-4xl font-bold font-heading text-star-white">
            Live Sky Tracker
          </h1>
          <p className="text-muted-gray mt-1">
            Track the International Space Station in real-time
          </p>
        </div>
      </div>

      {/* ISS Real-Time Map */}
      <section>
        <ISSMap />
      </section>

      {/* Info Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Satellite Info */}
        <div className="lg:col-span-1">
          <SatelliteInfo />
        </div>

        {/* Pass Predictions */}
        <div className="lg:col-span-1">
          <PassPrediction 
            latitude={location.lat} 
            longitude={location.lon} 
          />
        </div>

        {/* Overhead Satellites */}
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
