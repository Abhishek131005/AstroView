import { motion } from 'framer-motion';
import { Satellite } from 'lucide-react';

function TrackerPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Satellite className="w-8 h-8 text-electric-blue" />
        <div>
          <h1 className="text-4xl font-bold font-heading text-star-white">
            Live Sky Tracker
          </h1>
          <p className="text-muted-gray mt-1">
            Track satellites and celestial objects in real-time
          </p>
        </div>
      </div>

      {/* Map and tracker will be added in later phases */}
      <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-[600px] flex items-center justify-center">
        <p className="text-muted-gray">Interactive satellite tracker map</p>
      </div>
    </motion.div>
  );
}

export { TrackerPage };
