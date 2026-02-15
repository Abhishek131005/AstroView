import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Award, Search, Filter } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import GlossaryItem from '../components/learn/GlossaryItem';
import QuizCard from '../components/learn/QuizCard';
import Quiz from '../components/learn/Quiz';
import LearningPathCard from '../components/learn/LearningPathCard';
import LearningPathDetail from '../components/learn/LearningPathDetail';
import BadgeDisplay from '../components/learn/BadgeDisplay';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { simplifyText } from '../services/aiService';

// Import data
import glossaryData from '../data/glossary.json';
import quizzesData from '../data/quizzes.json';
import learningPathsData from '../data/learningPaths.json';

const categories = ['All', 'Orbital Mechanics', 'Solar System', 'Phenomena', 'Space Technology', 'Stars', 'Measurements', 'Navigation', 'Universe'];

function LearnPage() {
  const { quizScores, badges, learningProgress, updateQuizScore, addBadge, updateLearningProgress } = useContext(UserContext);
  
  // State for tabs
  const [activeTab, setActiveTab] = useState('glossary');
  
  // Glossary state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  
  // Learning path state
  const [activePath, setActivePath] = useState(null);
  const [showPathModal, setShowPathModal] = useState(false);

  // Filter glossary
  const filteredGlossary = glossaryData.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Alphabetical index
  const alphabeticalIndex = [...new Set(glossaryData.map(item => item.term[0].toUpperCase()))].sort();

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`glossary-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle quiz
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleQuizComplete = (quizId, score) => {
    updateQuizScore(quizId, score);
    setShowQuizModal(false);
    
    // Check for badges
    const quiz = quizzesData.find(q => q.id === quizId);
    if (score === quiz.questions.length && !badges.includes('quiz-master')) {
      addBadge('quiz-master');
    }
    
    // Check for perfect score badge (5 perfect scores)
    const perfectScores = Object.values(quizScores).filter(s => {
      const q = quizzesData.find(quiz => quiz.id === s.quizId);
      return q && s.score === q.questions.length;
    }).length;
    
    if (perfectScores >= 5 && !badges.includes('perfect-score')) {
      addBadge('perfect-score');
    }
  };

  // Handle learning path
  const handleStartPath = (path) => {
    setActivePath(path);
    setShowPathModal(true);
  };

  const handleStepComplete = (pathId, stepId, stepIndex) => {
    updateLearningProgress(pathId, stepId, stepIndex);
    
    // Check if path is complete
    const path = learningPathsData.find(p => p.id === pathId);
    const progress = learningProgress[pathId] || { completedSteps: [] };
    
    if (progress.completedSteps.length + 1 === path.steps.length && !badges.includes('path-completer')) {
      addBadge('path-completer');
    }
    
    // Check for goal setter badge (3 complete paths)
    const completedPaths = Object.values(learningProgress).filter(prog => {
      const p = learningPathsData.find(path => path.id === prog.pathId);
      return p && prog.completedSteps.length === p.steps.length;
    }).length;
    
    if (completedPaths >= 3 && !badges.includes('goal-setter')) {
      addBadge('goal-setter');
    }
  };

  const handleExplainSimply = async (text, context) => {
    try {
      const simplified = await simplifyText(text, context);
      return simplified;
    } catch (error) {
      console.error('Failed to simplify text:', error);
      return text; // Return original text on error
    }
  };

  const tabs = [
    { id: 'glossary', label: 'Glossary', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: GraduationCap },
    { id: 'paths', label: 'Learning Paths', icon: BookOpen },
    { id: 'badges', label: 'Badges', icon: Award }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <GraduationCap className="w-7 h-7 text-electric-blue" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">
            Learn & Explore
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Expand your knowledge of space and astronomy
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-electric-blue/20 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'border-electric-blue text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Glossary Tab */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search terms or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-bg-secondary border border-electric-blue/30 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-electric-blue"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gray pointer-events-none" />
            </div>
          </div>

          {/* Alphabetical Index */}
          <div className="flex flex-wrap gap-2">
            {alphabeticalIndex.map(letter => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className="w-8 h-8 bg-bg-secondary/50 border border-electric-blue/20 rounded-lg hover:border-electric-blue hover:bg-bg-secondary text-sm font-semibold text-white transition-all"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Glossary Items */}
          <div className="space-y-4">
            {alphabeticalIndex.map(letter => {
              const itemsForLetter = filteredGlossary.filter(item => item.term[0].toUpperCase() === letter);
              if (itemsForLetter.length === 0) return null;

              return (
                <div key={letter} id={`glossary-${letter}`}>
                  <h2 className="text-xl font-bold text-white mb-3 sticky top-0 bg-bg-primary/95 backdrop-blur py-1.5 z-10">
                    {letter}
                  </h2>
                  <div className="grid gap-4">
                    {itemsForLetter.map(item => (
                      <GlossaryItem
                        key={item.term}
                        item={item}
                        onExplainSimply={handleExplainSimply}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGlossary.length === 0 && (
            <div className="text-center py-12 text-muted-gray">
              No glossary items found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzesData.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              highScore={quizScores[quiz.id]?.score}
              onStart={() => handleStartQuiz(quiz)}
            />
          ))}
        </div>
      )}

      {/* Learning Paths Tab */}
      {activeTab === 'paths' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPathsData.map(path => (
            <LearningPathCard
              key={path.id}
              path={path}
              progress={learningProgress[path.id]}
              onStart={() => handleStartPath(path)}
            />
          ))}
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-bg-secondary/50 border border-white/10 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-1.5">Your Achievements</h2>
            <p className="text-muted-gray mb-4 text-sm">
              Earn badges by completing quizzes and learning paths. Show off your space knowledge!
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-electric-blue rounded-full"></div>
                <span className="text-gray-400">
                  {badges.length} {badges.length === 1 ? 'Badge' : 'Badges'} Earned
                </span>
              </div>
            </div>
          </div>

          <BadgeDisplay earnedBadges={badges} />
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && activeQuiz && (
        <Modal
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          title={activeQuiz.title}
        >
          <Quiz
            quiz={activeQuiz}
            onComplete={(score) => handleQuizComplete(activeQuiz.id, score)}
            onClose={() => setShowQuizModal(false)}
          />
        </Modal>
      )}

      {/* Learning Path Modal */}
      {showPathModal && activePath && (
        <Modal
          isOpen={showPathModal}
          onClose={() => setShowPathModal(false)}
          title={activePath.title}
          size="xl"
        >
          <LearningPathDetail
            path={activePath}
            progress={learningProgress[activePath.id]}
            onStepComplete={handleStepComplete}
            onClose={() => setShowPathModal(false)}
            onQuizComplete={handleQuizComplete}
          />
        </Modal>
      )}
    </motion.div>
  );
}

export { LearnPage };
