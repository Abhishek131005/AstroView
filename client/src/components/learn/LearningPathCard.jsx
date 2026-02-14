import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export default function LearningPathCard({ path, progress, onStart }) {
  const completedSteps = progress?.completedSteps || 0;
  const totalSteps = path.steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const isCompleted = completedSteps === totalSteps;
  const isStarted = completedSteps > 0;

  // Difficulty color mapping
  const difficultyColors = {
    'Beginner': 'text-green-400 bg-green-400/10 border-green-400/30',
    'Intermediate': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    'Advanced': 'text-red-400 bg-red-400/10 border-red-400/30'
  };

  return (
    <Card 
      variant="default" 
      className="h-full flex flex-col hover:border-cosmic-purple/60 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="bg-gradient-to-br from-cosmic-purple/20 to-electric-blue/20 p-3 rounded-lg">
          <BookOpen className="w-6 h-6 text-cosmic-purple" />
        </div>
        <Badge variant={isCompleted ? 'completed' : isStarted ? 'active' : 'planned'}>
          {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {path.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[path.difficulty] || difficultyColors.Beginner}`}>
            {path.difficulty}
          </span>
          <span className="text-xs px-2 py-1 rounded-full border text-gray-400 bg-gray-400/10 border-gray-400/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {path.estimatedTime}
          </span>
          <span className="text-xs px-2 py-1 rounded-full border text-electric-blue bg-electric-blue/10 border-electric-blue/30 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {totalSteps} Steps
          </span>
        </div>

        {/* Progress Bar */}
        {isStarted && !isCompleted && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{completedSteps} of {totalSteps} steps completed</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cosmic-purple to-electric-blue transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-cosmic-purple/10">
        <Button 
          variant="primary" 
          className="w-full"
          onClick={onStart}
        >
          {isCompleted ? 'Review Path' : isStarted ? 'Continue Learning' : 'Start Learning'}
        </Button>
      </div>
    </Card>
  );
}
