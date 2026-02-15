import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export default function GlossaryItem({ item, onExplainSimply }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState(null);

  const handleExplainSimply = async () => {
    setIsSimplifying(true);
    try {
      const result = await onExplainSimply(item.definition, `astronomy term: ${item.term}`);
      setSimplifiedText(result);
    } catch (error) {
      console.error('Failed to simplify:', error);
      setSimplifiedText('Failed to generate simplified explanation.');
    } finally {
      setIsSimplifying(false);
    }
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-electric-blue/20 rounded-lg p-5 hover:border-electric-blue/40 transition-all duration-300">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-white">{item.term}</h3>
              <Badge variant="default" className="text-xs">
                {item.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 italic">{item.pronunciation}</p>
          </div>
          
          {onExplainSimply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExplainSimply}
              disabled={isSimplifying}
              className="flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              {isSimplifying ? 'Simplifying...' : 'Explain Simply'}
            </Button>
          )}
        </div>

        {/* Definition */}
        <p className="text-gray-300 leading-relaxed">
          {simplifiedText || item.definition}
        </p>

        {/* Visual Example (Expandable) */}
        {item.visualExample && (
          <div className="border-t border-electric-blue/10 pt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-electric-blue hover:text-electric-blue/80 transition-colors text-sm font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Visual Example
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show Visual Example
                </>
              )}
            </button>
            
            {isExpanded && (
              <div className="mt-3 p-4 bg-cosmic-purple/10 border border-cosmic-purple/20 rounded-lg">
                <p className="text-gray-300 leading-relaxed italic">
                  {item.visualExample}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
