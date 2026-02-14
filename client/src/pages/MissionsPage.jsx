import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

function MissionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Rocket className="w-8 h-8 text-electric-blue" />
        <div>
          <h1 className="text-4xl font-bold font-heading text-star-white">
            Mission Control
          </h1>
          <p className="text-muted-gray mt-1">
            Explore current and upcoming space missions
          </p>
        </div>
      </div>

      {/* Mission grid will be added in later phases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-muted-gray">Active missions</p>
        </div>
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-muted-gray">Upcoming launches</p>
        </div>
      </div>
    </motion.div>
  );
}

export { MissionsPage };
