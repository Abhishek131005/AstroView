import { motion } from 'framer-motion';
import { Calendar, Rocket } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { formatDate } from '@/utils/formatters';

const AGENCY_COLORS = {
  'NASA': 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
  'ESA': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'ISRO': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'CNSA': 'bg-red-500/20 text-red-400 border-red-500/30',
  'SpaceX': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'NASA/ESA': 'bg-gradient-to-r from-electric-blue/20 to-blue-500/20 text-electric-blue border-electric-blue/30',
  'NASA/ESA/CSA': 'bg-gradient-to-r from-electric-blue/20 to-blue-500/20 text-electric-blue border-electric-blue/30',
  'NASA/ESA/CSA/JAXA': 'bg-gradient-to-r from-electric-blue/20 to-teal-500/20 text- border-electric-blue/30',
  'NASA/Roscosmos/ESA/JAXA': 'bg-gradient-to-r from-electric-blue/20 to-green-500/20 text-electric-blue border-electric-blue/30',
};

const STATUS_VARIANTS = {
  'active': 'active',
  'completed': 'completed',
  'planned': 'planned'
};

function MissionCard({ mission, onClick }) {
  const agencyColor = AGENCY_COLORS[mission.agency] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <motion.div
      onClick={() => onClick(mission)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-bg-secondary border border-white/10 rounded-xl p-5 cursor-pointer hover:border-electric-blue/30 transition-all duration-300 group"
    >
      {/* Agency Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${agencyColor}`}>
          {mission.agency}
        </span>
        <Badge variant={STATUS_VARIANTS[mission.status]}>
          {mission.status}
        </Badge>
      </div>

      {/* Mission Name */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-blue transition-colors">
        {mission.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">
        {mission.description}
      </p>

      {/* Spacecraft & Type */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <Rocket className="w-3.5 h-3.5 text-muted-gray" />
        <span className="text-muted-gray">{mission.spacecraft}</span>
      </div>

      {/* Launch Date */}
      <div className="flex items-center gap-2 text-xs mt-auto">
        <Calendar className="w-3.5 h-3.5 text-muted-gray" />
        <span className="text-muted-gray">
          {mission.status === 'planned' ? 'Planned: ' : 'Launched: '}
          {formatDate(mission.launchDate, 'PPP')}
        </span>
      </div>

      {/* Crew Count (if applicable) */}
      {mission.crew && mission.crew.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-xs text-electric-blue">
            👨‍🚀 {mission.crew.length} crew member{mission.crew.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default MissionCard;
