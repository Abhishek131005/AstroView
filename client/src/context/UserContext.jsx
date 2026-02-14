import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/constants';

const UserContext = createContext();

function UserProvider({ children }) {
  const [quizScores, setQuizScores] = useLocalStorage(STORAGE_KEYS.QUIZ_SCORES, {});
  const [badges, setBadges] = useLocalStorage(STORAGE_KEYS.BADGES, []);
  const [completedPaths, setCompletedPaths] = useLocalStorage(
    STORAGE_KEYS.COMPLETED_LEARNING_PATHS,
    []
  );

  // Update quiz score for a specific quiz
  const updateScore = useCallback((quizId, score, maxScore) => {
    setQuizScores(prev => ({
      ...prev,
      [quizId]: {
        score,
        maxScore,
        percentage: Math.round((score / maxScore) * 100),
        timestamp: new Date().toISOString(),
      },
    }));
  }, [setQuizScores]);

  // Add a new badge
  const addBadge = useCallback((badge) => {
    setBadges(prev => {
      // Check if badge already exists
      const exists = prev.some(b => b.id === badge.id);
      if (exists) return prev;
      
      return [...prev, {
        ...badge,
        earnedAt: new Date().toISOString(),
      }];
    });
  }, [setBadges]);

  // Mark a learning path step as complete
  const completeStep = useCallback((pathId, stepId) => {
    setCompletedPaths(prev => {
      const path = prev.find(p => p.id === pathId);
      
      if (path) {
        // Update existing path
        return prev.map(p => 
          p.id === pathId
            ? {
                ...p,
                steps: [...new Set([...p.steps, stepId])],
                lastUpdated: new Date().toISOString(),
              }
            : p
        );
      } else {
        // Create new path entry
        return [...prev, {
          id: pathId,
          steps: [stepId],
          startedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        }];
      }
    });
  }, [setCompletedPaths]);

  // Check if a path is completed
  const isPathCompleted = useCallback((pathId, totalSteps) => {
    const path = completedPaths.find(p => p.id === pathId);
    return path && path.steps.length >= totalSteps;
  }, [completedPaths]);

  // Get progress for a specific path
  const getPathProgress = useCallback((pathId, totalSteps) => {
    const path = completedPaths.find(p => p.id === pathId);
    const completed = path?.steps.length || 0;
    
    return {
      completed,
      total: totalSteps,
      percentage: Math.round((completed / totalSteps) * 100),
    };
  }, [completedPaths]);

  // Get total statistics
  const getStats = useCallback(() => {
    const totalQuizzes = Object.keys(quizScores).length;
    const totalBadges = badges.length;
    const totalPaths = completedPaths.length;
    
    const averageScore = totalQuizzes > 0
      ? Math.round(
          Object.values(quizScores).reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes
        )
      : 0;

    return {
      quizzesTaken: totalQuizzes,
      badgesEarned: totalBadges,
      pathsStarted: totalPaths,
      averageScore,
    };
  }, [quizScores, badges, completedPaths]);

  // Reset all user data
  const resetUserData = useCallback(() => {
    setQuizScores({});
    setBadges([]);
    setCompletedPaths([]);
  }, [setQuizScores, setBadges, setCompletedPaths]);

  const value = {
    quizScores,
    badges,
    completedPaths,
    updateScore,
    addBadge,
    completeStep,
    isPathCompleted,
    getPathProgress,
    getStats,
    resetUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use user context
function useUserContext() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  
  return context;
}

export { UserContext, UserProvider, useUserContext };
