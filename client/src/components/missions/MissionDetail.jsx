import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Rocket, Target, CheckCircle, Circle, Image as ImageIcon, Users, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { formatDate } from '@/utils/formatters';
import { simplifyText } from '@/services/aiService';

const STATUS_VARIANTS = {
  'active': 'active',
  'completed': 'completed',
  'planned': 'planned'
};

function MissionDetail({ mission, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSimple, setShowSimple] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);

  if (!mission) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'impact', label: 'Impact' },
  ];

  // Only add media tab if there are crew members or images
  if ((mission.crew && mission.crew.length > 0) || (mission.images && mission.images.length > 0)) {
    tabs.push({ id: 'media', label: 'Media & Crew' });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 pt-20 pb-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-bg-secondary border border-white/10 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-white">{mission.name}</h2>
                  <Badge variant={STATUS_VARIANTS[mission.status]}>
                    {mission.status}
                  </Badge>
                </div>
                <p className="text-muted-gray">{mission.agency}</p>
              </div>
              <button
                onClick={onClose}
                className="text-muted-gray hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-electric-blue text-white'
                      : 'text-muted-gray hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mission Objective</h3>
                  <p className="text-gray-300 leading-relaxed">{mission.description}</p>
                  
                  {/* Explain Simply Toggle */}
                  <button
                    onClick={async () => {
                      setShowSimple(!showSimple);
                      if (!simplifiedText && !showSimple) {
                        setIsSimplifying(true);
                        try {
                          const result = await simplifyText(mission.description, `space mission: ${mission.name}`);
                          setSimplifiedText(typeof result === 'object' ? result.simplified : result);
                        } catch (error) {
                          setSimplifiedText('AI service unavailable. Using original text.');
                        } finally {
                          setIsSimplifying(false);
                        }
                      }
                    }}
                    className="mt-2 text-sm text-electric-blue hover:text-electric-blue/80 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className={`w-4 h-4 ${isSimplifying ? 'animate-pulse' : ''}`} />
                    {showSimple ? 'Show Original' : 'Explain Simply'}
                  </button>

                  {showSimple && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-4 bg-electric-blue/10 rounded-lg border border-electric-blue/20"
                    >
                      {isSimplifying ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-electric-blue" />
                          <span className="text-sm text-electric-blue">Simplifying with AI...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-electric-blue font-semibold mb-1 uppercase tracking-wide">AI Simplified</p>
                          <p className="text-sm text-gray-200 italic">"{simplifiedText}"</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="w-4 h-4 text-muted-gray" />
                      <span className="text-sm text-muted-gray">Spacecraft</span>
                    </div>
                    <p className="text-white font-medium">{mission.spacecraft}</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-gray" />
                      <span className="text-sm text-muted-gray">Launch Date</span>
                    </div>
                    <p className="text-white font-medium">{formatDate(mission.launchDate, 'PPP')}</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-muted-gray" />
                      <span className="text-sm text-muted-gray">Mission Type</span>
                    </div>
                    <p className="text-white font-medium capitalize">{mission.missionType.replace(/-/g, ' ')}</p>
                  </div>

                  {mission.crew && mission.crew.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-gray" />
                        <span className="text-sm text-muted-gray">Crew Size</span>
                      </div>
                      <p className="text-white font-medium">{mission.crew.length} astronauts</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4">Mission Timeline</h3>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10" />

                  {/* Timeline Events */}
                  <div className="space-y-4">
                    {mission.timeline.map((event, index) => (
                      <div key={index} className="relative pl-10">
                        {/* Icon */}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-green-500/20 border-2 border-green-500' : 'bg-white/5 border-2 border-white/20'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-3 h-3 text-white/30" />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`p-3 rounded-lg ${event.completed ? 'bg-green-500/5' : 'bg-white/5'}`}>
                          <p className="text-sm text-muted-gray mb-1">{formatDate(event.date, 'PPP')}</p>
                          <p className={`text-sm ${event.completed ? 'text-white' : 'text-gray-400'}`}>
                            {event.event}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Real-World Impact</h3>
                <div className="p-4 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
                  <p className="text-gray-200 leading-relaxed">{mission.impact}</p>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-4">
                {/* Crew */}
                {mission.crew && mission.crew.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Crew Members</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {mission.crew.map((member, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 text-center">
                          <div className="w-12 h-12 rounded-full bg-electric-blue/20 text-electric-blue flex items-center justify-center mx-auto mb-2 text-xl">
                            👨‍🚀
                          </div>
                          <p className="text-sm text-white font-medium">{member}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                {mission.images && mission.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Media Gallery</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {mission.images.map((image, index) => (
                        <div key={index} className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-gray" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!mission.crew || mission.crew.length === 0) && (!mission.images || mission.images.length === 0) && (
                  <p className="text-center text-muted-gray py-8">No media available for this mission.</p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 217, 255, 0.3);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 217, 255, 0.5);
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

export default MissionDetail;
