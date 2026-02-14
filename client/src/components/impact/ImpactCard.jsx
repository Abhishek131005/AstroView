import { useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Sparkles, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

function ImpactCard({ story, categoryColor }) {
  const [showSimple, setShowSimple] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"
    >
      {/* Title */}
      <h4 className="text-lg font-semibold text-white mb-2">{story.title}</h4>

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed mb-3">
        {story.description}
      </p>

      {/* Satellites Involved */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Satellite className="w-4 h-4 text-muted-gray" />
        <span className="text-xs text-muted-gray">Satellites:</span>
        {story.satellites.map((sat, index) => (
          <Badge key={index} variant="default" size="sm">
            {sat}
          </Badge>
        ))}
      </div>

      {/* Real-World Example */}
      <div className={`p-3 bg-${categoryColor}/10 border border-${categoryColor}/20 rounded-lg mb-3`}>
        <div className="flex items-start gap-2">
          <CheckCircle className={`w-4 h-4 text-${categoryColor} mt-0.5 flex-shrink-0`} />
          <div>
            <p className="text-xs text-muted-gray mb-1 font-medium">Real-World Example</p>
            <p className="text-sm text-gray-200 leading-relaxed">
              {story.example}
            </p>
          </div>
        </div>
      </div>

      {/* Explain Simply Toggle */}
      <button
        onClick={() => setShowSimple(!showSimple)}
        className="text-sm text-electric-blue hover:text-electric-blue/80 transition-colors flex items-center gap-1"
      >
        <Sparkles className="w-4 h-4" />
        {showSimple ? 'Show Original' : 'Explain Simply'}
      </button>

      {showSimple && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5"
        >
          <p className="text-sm text-gray-300">
            Simplified explanation feature coming soon! This will use AI to make the description even easier to understand.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ImpactCard;
