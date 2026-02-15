import { Trophy, BookOpen } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export default function QuizCard({ quiz, highScore, onStart }) {
  const totalQuestions = quiz.questions.length;
  const scorePercentage = highScore ? Math.round((highScore / totalQuestions) * 100) : 0;

  return (
    <Card 
      variant="default" 
      className="h-full flex flex-col hover:border-electric-blue/60 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="bg-gradient-to-br from-electric-blue/20 to-cosmic-purple/20 p-3 rounded-lg">
          <BookOpen className="w-6 h-6 text-electric-blue" />
        </div>
        {highScore !== null && highScore !== undefined && (
          <Badge 
            variant={scorePercentage === 100 ? 'completed' : 'active'} 
            className="flex items-center gap-1"
          >
            <Trophy className="w-3 h-3" />
            {scorePercentage}%
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {quiz.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
            <span className="text-gray-400">
              {totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
          {highScore !== null && highScore !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-gray-400">
                High Score: {highScore}/{totalQuestions}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-electric-blue/10">
        <Button 
          variant="primary" 
          className="w-full"
          onClick={onStart}
        >
          {highScore !== null && highScore !== undefined ? 'Retake Quiz' : 'Start Quiz'}
        </Button>
      </div>
    </Card>
  );
}
