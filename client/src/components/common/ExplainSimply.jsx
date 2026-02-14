import { useState } from 'react';
import { Sparkles, Loader2, RotateCcw } from 'lucide-react';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExplainSimply({ text, context, fallbackText }) {
  const [isSimplified, setIsSimplified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState(null);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    if (isSimplified) {
      // Toggle back to original
      setIsSimplified(false);
      setSimplifiedText(null);
      setError(null);
      return;
    }

    // Try to simplify
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, context }),
      });

      if (!response.ok) {
        throw new Error('Failed to simplify text');
      }

      const data = await response.json();
      setSimplifiedText(data.simplified || fallbackText || text);
      setIsSimplified(true);
    } catch (err) {
      console.error('Error simplifying text:', err);
      
      // Use fallback if available
      if (fallbackText) {
        setSimplifiedText(fallbackText);
        setIsSimplified(true);
      } else {
        setError('Could not simplify at this time. Try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Simplifying...
            </>
          ) : isSimplified ? (
            <>
              <RotateCcw className="w-4 h-4" />
              Show Original
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Explain Simply
            </>
          )}
        </Button>
      </div>

      {/* Content Display */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {isSimplified && simplifiedText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cosmic-purple shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-cosmic-purple mb-1">
                  Simplified Explanation
                </div>
                <p className="text-gray-300 leading-relaxed">{simplifiedText}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
