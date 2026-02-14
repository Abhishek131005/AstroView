import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz({ quiz, onComplete, onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (optionIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const handleFinish = () => {
    onComplete(score);
    onClose();
  };

  const scorePercentage = Math.round((score / totalQuestions) * 100);

  if (showResults) {
    return (
      <div className="text-center space-y-6 py-8">
        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="flex justify-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            scorePercentage === 100 
              ? 'bg-gradient-to-br from-amber-500 to-yellow-600' 
              : scorePercentage >= 70 
                ? 'bg-gradient-to-br from-electric-blue to-cosmic-purple' 
                : 'bg-gradient-to-br from-gray-600 to-gray-700'
          }`}>
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Results */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {scorePercentage === 100 
              ? '🎉 Perfect Score!' 
              : scorePercentage >= 70 
                ? '✨ Great Job!' 
                : '💪 Keep Learning!'}
          </h2>
          <p className="text-gray-400">
            You scored {score} out of {totalQuestions} ({scorePercentage}%)
          </p>
        </div>

        {/* Message */}
        <div className="bg-dark-800/50 border border-electric-blue/20 rounded-lg p-6">
          <p className="text-gray-300 leading-relaxed">
            {scorePercentage === 100 
              ? "Outstanding! You've mastered this topic. You're ready to explore more advanced concepts!"
              : scorePercentage >= 70 
                ? "Well done! You have a solid understanding. Review the questions you missed to perfect your knowledge."
                : "Don't worry! Learning takes time. Review the material and try again. You've got this!"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={handleRetry}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="primary" onClick={handleFinish}>
            Finish Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-electric-blue to-cosmic-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Question Text */}
          <div className="bg-gradient-to-br from-electric-blue/10 to-cosmic-purple/10 border border-electric-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctAnswer;
              const isSelected = index === selectedAnswer;
              const showCorrect = isAnswered && isCorrect;
              const showIncorrect = isAnswered && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    showCorrect
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : showIncorrect
                        ? 'bg-red-500/20 border-red-500 text-white'
                        : isAnswered
                          ? 'bg-dark-800/30 border-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-dark-800/50 border-electric-blue/30 hover:border-electric-blue hover:bg-dark-800 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1 font-medium">{option}</span>
                    {showCorrect && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800/50 border border-cosmic-purple/30 rounded-lg p-5"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cosmic-purple shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Explanation</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <Button variant="primary" onClick={handleNext}>
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    See Results
                    <Trophy className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
