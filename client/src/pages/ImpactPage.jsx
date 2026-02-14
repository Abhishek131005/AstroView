import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

function ImpactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Globe className="w-8 h-8 text-electric-blue" />
        <div>
          <h1 className="text-4xl font-bold font-heading text-star-white">
            Space to Earth
          </h1>
          <p className="text-muted-gray mt-1">
            How space affects life on Earth
          </p>
        </div>
      </div>

      {/* Impact data will be added in later phases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-80 flex items-center justify-center">
          <p className="text-muted-gray">Natural events (asteroids, solar storms)</p>
        </div>
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-80 flex items-center justify-center">
          <p className="text-muted-gray">Space weather forecast</p>
        </div>
      </div>
    </motion.div>
  );
}

export { ImpactPage };
