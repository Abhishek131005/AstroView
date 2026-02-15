import { motion } from 'framer-motion';
import { APODHero } from '@/components/home/APODHero';
import { LocationPicker } from '@/components/home/LocationPicker';
import { SkyConditions } from '@/components/home/SkyConditions';
import { EventList } from '@/components/home/EventList';

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Hero Section - Astronomy Picture of the Day */}
      <section>
        <APODHero />
      </section>

      {/* Location & Sky Conditions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LocationPicker />
        <SkyConditions />
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-1">
            <span className="gradient-text">Upcoming Celestial Events</span>
          </h2>
          <p className="text-muted-gray text-sm">
            Don't miss these amazing astronomical events happening this week
          </p>
        </div>
        <EventList />
      </section>
    </motion.div>
  );
}

export { HomePage };
