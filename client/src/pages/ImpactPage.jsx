import { motion } from 'framer-motion';
import { Globe, MapPin, Zap } from 'lucide-react';
import { ImpactCategory } from '@/components/impact/ImpactCategory';
import { EarthEventsMap } from '@/components/impact/EarthEventsMap';
import { NEOSection } from '@/components/impact/NEOSection';
import impactData from '@/data/impactData.json';

function ImpactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Globe className="w-7 h-7 text-electric-blue" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-star-white">
            Space to Earth
          </h1>
          <p className="text-muted-gray text-sm mt-0.5">
            How satellites and space technology impact life on Earth every day
          </p>
        </div>
      </div>

      {/* Impact Categories */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">
            <span className="gradient-text">Satellite Applications</span>
          </h2>
          <p className="text-muted-gray text-sm">
            Discover how satellites help us in climate monitoring, agriculture, disaster response, and more
          </p>
        </div>

        <div className="space-y-4">
          {impactData.categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ImpactCategory category={category} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Earth Events */}
      <section>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-electric-blue" />
            <h2 className="text-xl font-bold text-white">
              <span className="gradient-text">Live Earth Events</span>
            </h2>
          </div>
          <p className="text-muted-gray text-sm">
            Real-time natural events detected by NASA's Earth Observing System
          </p>
        </div>

        <EarthEventsMap />
      </section>

      {/* Near-Earth Objects */}
      <section>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-electric-blue" />
            <h2 className="text-xl font-bold text-white">
              <span className="gradient-text">Planetary Defense</span>
            </h2>
          </div>
          <p className="text-muted-gray text-sm">
            Tracking asteroids that pass close to Earth
          </p>
        </div>

        <NEOSection />
      </section>
    </motion.div>
  );
}

export { ImpactPage };
