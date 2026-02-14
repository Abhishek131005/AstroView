import { useState } from 'react';
import { CheckCircle, Circle, ExternalLink, BookOpen, Award } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Quiz from './Quiz';
import { motion } from 'framer-motion';
import quizzesData from '../../data/quizzes.json';

export default function LearningPathDetail({ path, progress, onStepComplete, onClose, onQuizComplete }) {
  const [activeStepIndex, setActiveStepIndex] = useState(
    progress?.lastActiveStep || 0
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);

  const activeStep = path.steps[activeStepIndex];
  const completedSteps = progress?.completedSteps || [];
  const isStepCompleted = completedSteps.includes(activeStep.id);

  const handleStepClick = (index) => {
    setActiveStepIndex(index);
  };

  const handleMarkComplete = () => {
    onStepComplete(path.id, activeStep.id, activeStepIndex);
    
    // Auto-advance to next step if not on last step
    if (activeStepIndex < path.steps.length - 1) {
      setTimeout(() => {
        setActiveStepIndex(activeStepIndex + 1);
      }, 300);
    }
  };

  const handleStartQuiz = (quizId) => {
    setCurrentQuizId(quizId);
    setShowQuiz(true);
  };

  const handleQuizComplete = (score) => {
    setShowQuiz(false);
    onQuizComplete(currentQuizId, score);
    handleMarkComplete();
  };

  const allStepsCompleted = path.steps.every(step => 
    completedSteps.includes(step.id)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] max-h-[800px]">
      {/* Steps Sidebar */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-dark-800/50 border border-electric-blue/20 rounded-lg p-4 h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-cosmic-purple" />
            <h3 className="font-semibold text-white">Learning Steps</h3>
          </div>

          <div className="space-y-2">
            {path.steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = index === activeStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? 'bg-electric-blue/20 border-electric-blue'
                      : isCompleted
                        ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                        : 'bg-dark-800/30 border-gray-700 hover:bg-dark-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white mb-1">
                        Step {index + 1}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-400'} line-clamp-2`}>
                        {step.title}
                      </div>
                      {step.type === 'quiz' && (
                        <div className="mt-1">
                          <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                            Quiz
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Completion Badge */}
          {allStepsCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-500/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-500" />
                <div>
                  <div className="font-semibold text-white text-sm">Path Completed!</div>
                  <div className="text-xs text-gray-300">You've finished all steps</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-dark-800/50 border border-electric-blue/20 rounded-lg p-6 lg:p-8">
          <motion.div
            key={activeStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Step Header */}
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Step {activeStepIndex + 1} of {path.steps.length}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {activeStep.title}
              </h2>
            </div>

            {/* Step Content */}
            {activeStep.type === 'content' && (
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {activeStep.content}
                </div>
              </div>
            )}

            {activeStep.type === 'quiz' && !showQuiz && (
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 border border-amber-500/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/20 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">Quiz Time!</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Test your knowledge from the previous steps. Complete the quiz to continue.
                    </p>
                    <Button variant="primary" onClick={() => handleStartQuiz(activeStep.quizId)}>
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeStep.type === 'external' && (
              <div className="bg-electric-blue/10 border border-electric-blue/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <ExternalLink className="w-6 h-6 text-electric-blue shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">External Resource</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      This step includes an external resource. Click the link below to continue learning.
                    </p>
                    <a
                      href={activeStep.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-electric-blue hover:text-electric-blue/80 transition-colors inline-flex items-center gap-2"
                    >
                      Open Resource
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-electric-blue/10">
              <Button
                variant="secondary"
                onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                disabled={activeStepIndex === 0}
              >
                Previous Step
              </Button>

              <div className="flex gap-3">
                {!isStepCompleted && activeStep.type !== 'quiz' && (
                  <Button variant="primary" onClick={handleMarkComplete}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}

                {activeStepIndex < path.steps.length - 1 && (
                  <Button
                    variant="primary"
                    onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                  >
                    Next Step
                  </Button>
                )}

                {activeStepIndex === path.steps.length - 1 && allStepsCompleted && (
                  <Button variant="primary" onClick={onClose}>
                    Finish Path
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentQuizId && (
        <Modal isOpen={showQuiz} onClose={() => setShowQuiz(false)} title="Quiz">
          <Quiz
            quiz={quizzesData.find(q => q.id === currentQuizId) || { id: currentQuizId, questions: [] }}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        </Modal>
      )}
    </div>
  );
}
