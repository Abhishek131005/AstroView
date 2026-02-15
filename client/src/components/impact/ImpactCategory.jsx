import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Globe, Leaf, AlertTriangle, Navigation, Radio } from 'lucide-react';
import ImpactCard from './ImpactCard';
import { Badge } from '@/components/common/Badge';

const ICON_MAP = {
  'earth': Globe,
  'leaf': Leaf,
  'alert-triangle': AlertTriangle,
  'navigation': Navigation,
  'radio': Radio
};

function ImpactCategory({ category }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICON_MAP[category.icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-secondary border border-white/10 rounded-xl overflow-hidden"
    >
      {/* Category Header (Clickable) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`p-3 rounded-lg bg-${category.color}/10 text-${category.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              <Badge variant="default" size="sm">
                {category.satelliteCount} satellites
              </Badge>
            </div>
            <p className="text-sm text-muted-gray">
              {category.description}
            </p>
          </div>
        </div>

        <div className="ml-4">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-gray" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-gray" />
          )}
        </div>
      </button>

      {/* Expanded Stories */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-6 space-y-4">
              {category.stories.map(story => (
                <ImpactCard key={story.id} story={story} categoryColor={category.color} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { ImpactCategory };
