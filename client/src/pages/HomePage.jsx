import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-electric-blue" />
          <h1 className="text-5xl md:text-6xl font-bold font-heading gradient-text mb-4">
            Tonight's Sky
          </h1>
          <p className="text-xl text-muted-gray max-w-2xl mx-auto">
            Discover what's happening in space right now
          </p>
        </motion.div>
      </div>

      {/* Content sections will be added in later phases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Astronomy Picture of the Day */}
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-muted-gray">Astronomy Picture of the Day</p>
        </div>

        {/* ISS Location */}
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-muted-gray">ISS Location</p>
        </div>

        {/* Upcoming Events */}
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-muted-gray">Upcoming Events</p>
        </div>
      </div>
    </motion.div>
  );
}

export { HomePage };
