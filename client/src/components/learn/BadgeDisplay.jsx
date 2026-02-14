import { Trophy, Award, Star, Zap, Target, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const badgeIcons = {
  'quiz-master': Trophy,
  'path-completer': Award,
  'perfect-score': Star,
  'quick-learner': Zap,
  'goal-setter': Target
};

const badgeConfig = {
  'quiz-master': {
    title: 'Quiz Master',
    description: 'Score 100% on any quiz',
    color: 'from-amber-500 to-yellow-600'
  },
  'path-completer': {
    title: 'Path Completer',
    description: 'Complete a learning path',
    color: 'from-electric-blue to-blue-600'
  },
  'perfect-score': {
    title: 'Perfect Score',
    description: 'Score 100% on 5 quizzes',
    color: 'from-purple-500 to-pink-600'
  },
  'quick-learner': {
    title: 'Quick Learner',
    description: 'Complete 10 learning steps',
    color: 'from-green-500 to-emerald-600'
  },
  'goal-setter': {
    title: 'Goal Setter',
    description: 'Complete 3 learning paths',
    color: 'from-orange-500 to-red-600'
  }
};

export default function BadgeDisplay({ earnedBadges = [] }) {
  const allBadgeTypes = Object.keys(badgeConfig);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {allBadgeTypes.map((badgeType, index) => {
        const isEarned = earnedBadges.includes(badgeType);
        const config = badgeConfig[badgeType];
        const Icon = badgeIcons[badgeType] || Trophy;

        return (
          <motion.div
            key={badgeType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div
              className={`aspect-square rounded-lg border-2 p-4 flex flex-col items-center justify-center transition-all duration-300 ${
                isEarned
                  ? `bg-gradient-to-br ${config.color} border-transparent shadow-lg group-hover:scale-105`
                  : 'bg-dark-800/50 border-gray-700 opacity-50'
              }`}
            >
              {/* Icon */}
              <div className="relative mb-2">
                <Icon
                  className={`w-12 h-12 ${
                    isEarned ? 'text-white' : 'text-gray-600'
                  }`}
                />
                {!isEarned && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="text-center">
                <div
                  className={`text-sm font-bold ${
                    isEarned ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {config.title}
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-dark-900 border border-electric-blue/30 rounded-lg p-3 shadow-xl min-w-[200px]">
                  <div className="text-sm font-semibold text-white mb-1">
                    {config.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {config.description}
                  </div>
                  {isEarned && (
                    <div className="mt-2 pt-2 border-t border-electric-blue/20">
                      <div className="text-xs text-green-400 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Earned!
                      </div>
                    </div>
                  )}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-dark-900"></div>
              </div>
            </div>

            {/* Earned indicator */}
            {isEarned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
              >
                <Trophy className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
