import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

function CalendarPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-electric-blue" />
        <div>
          <h1 className="text-4xl font-bold font-heading text-star-white">
            Space Calendar
          </h1>
          <p className="text-muted-gray mt-1">
            Track upcoming space events and alerts
          </p>
        </div>
      </div>

      {/* Calendar and events will be added in later phases */}
      <div className="space-y-6">
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-96 flex items-center justify-center">
          <p className="text-muted-gray">Interactive calendar view</p>
        </div>
        
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center">
          <p className="text-muted-gray">Upcoming events timeline</p>
        </div>
      </div>
    </motion.div>
  );
}

export { CalendarPage };
