import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { MissionList } from '@/components/missions/MissionList';

function MissionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Rocket className="w-7 h-7 text-electric-blue" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-star-white">
            Mission Control
          </h1>
          <p className="text-muted-gray text-sm mt-0.5">
            Explore current and upcoming space missions from around the world
          </p>
        </div>
      </div>

      {/* Mission List */}
      <MissionList />
    </motion.div>
  );
}

export { MissionsPage };
