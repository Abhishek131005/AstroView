import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Satellite, 
  Moon, 
  Circle, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Loader2
} from 'lucide-react';
import { CountdownTimer } from '@/components/common/CountdownTimer';
import { Badge } from '@/components/common/Badge';
import { formatDate } from '@/utils/formatters';
import { simplifyText } from '@/services/aiService';

const EVENT_TYPE_CONFIG = {
  satellite: {
    icon: Satellite,
    color: 'text-electric-blue',
    bgColor: 'bg-electric-blue/10',
    label: 'Satellite Pass'
  },
  planet: {
    icon: Circle,
    color: 'text-cosmic-purple',
    bgColor: 'bg-cosmic-purple/10',
    label: 'Planetary Event'
  },
  moon: {
    icon: Moon,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    label: 'Lunar Event'
  },
  'deep-sky': {
    icon: Sparkles,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    label: 'Deep Sky Object'
  }
};

function EventCard({ event }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);

  const config = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG['planet'];
  const Icon = config.icon;

  const getVisibilityVariant = (visibility) => {
    switch (visibility) {
      case 'excellent':
        return 'active';
      case 'good':
        return 'completed';
      case 'fair':
        return 'planned';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-bg-secondary border border-white/10 rounded-xl p-4 hover:border-electric-blue/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`${config.bgColor} ${config.color} p-2.5 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-white text-lg">{event.name}</h3>
            {event.visibility && (
              <Badge variant={getVisibilityVariant(event.visibility)} size="sm">
                <Eye className="w-3 h-3" />
                {event.visibility}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-gray mb-2">
            {formatDate(event.date, 'PPp')}
          </p>
          
          <p className="text-sm text-gray-300 mb-3">
            {event.description}
          </p>

          {/* Countdown Timer */}
          <CountdownTimer targetDate={event.date} />

          {/* Event Details */}
          {event.maxElevation && (
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-gray">Max Elevation:</span>
                <span className="text-white font-mono">{event.maxElevation}°</span>
              </div>
              {event.brightness && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-gray">Magnitude:</span>
                  <span className="text-white font-mono">{event.brightness}</span>
                </div>
              )}
            </div>
          )}

          {/* Viewing Instructions Toggle */}
          {event.viewingInstructions && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-electric-blue hover:text-electric-blue/80 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isExpanded ? 'Hide' : 'Show'} Viewing Instructions
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5"
                >
                  <p className="text-sm text-gray-300 leading-relaxed mb-2">
                    {event.viewingInstructions}
                  </p>
                  
                  {/* Explain Simply Toggle */}
                  <button
                    onClick={async () => {
                      setShowSimple(!showSimple);
                      if (!simplifiedText && !showSimple) {
                        setIsSimplifying(true);
                        try {
                          const result = await simplifyText(event.viewingInstructions, `viewing instructions: ${event.name}`);
                          setSimplifiedText(typeof result === 'object' ? result.simplified : result);
                        } catch (error) {
                          setSimplifiedText('AI service unavailable. Using original text.');
                        } finally {
                          setIsSimplifying(false);
                        }
                      }
                    }}
                    className="text-xs text-electric-blue hover:text-electric-blue/80 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className={`w-3 h-3 ${isSimplifying ? 'animate-pulse' : ''}`} />
                    {showSimple ? 'Show Original' : 'Explain Simply'}
                  </button>

                  {showSimple && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-3 bg-electric-blue/10 rounded-lg border border-electric-blue/20"
                    >
                      {isSimplifying ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin text-electric-blue" />
                          <span className="text-xs text-electric-blue">Simplifying with AI...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-electric-blue font-semibold mb-1 uppercase tracking-wide">AI Simplified</p>
                          <p className="text-xs text-gray-200 italic">"{simplifiedText}"</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export { EventCard };
