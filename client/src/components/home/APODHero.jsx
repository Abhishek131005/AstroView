import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Loader2, Maximize2 } from 'lucide-react';
import { getAPOD } from '@/services/nasaService';
import { simplifyText } from '@/services/aiService';
import { Skeleton } from '@/components/common/Skeleton';
import { formatDate } from '@/utils/formatters';
import { Modal } from '@/components/common/Modal';

function APODHero() {
  const [apod, setApod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSimple, setShowSimple] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [showFullArticle, setShowFullArticle] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const data = await getAPOD();
        setApod(data);
        setIsFallback(false);
      } catch (err) {
        // If rate limited, use fallback APOD data
        if (err.response?.status === 429) {
          console.warn('NASA API rate limited - using cached APOD');
          setApod(getFallbackAPOD());
          setIsFallback(true);
        } else {
          setError(err.message || 'Failed to load Astronomy Picture of the Day');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  // Fallback APOD when NASA API is rate limited
  const getFallbackAPOD = () => ({
    title: "The Rosette Nebula",
    explanation: "What creates the cosmic dust sculptures in the Rosette Nebula? Noted for the common beauty of its overall shape, parts of the Rosette Nebula, also known as NGC 2237, show beauty even when viewed up close. Visible in the featured image are globules of dark dust and gas that are slowly being eroded away by the energetic light and winds by nearby massive stars. Left alone long enough, the molecular-cloud globules would likely form stars and planets. The Rosette Nebula spans about 130 light years across, lies about 5,000 light years away, and can be seen with binoculars towards the constellation of the Unicorn (Monoceros).",
    url: "https://apod.nasa.gov/apod/image/2402/Rosette_Patel_960.jpg",
    hdurl: "https://apod.nasa.gov/apod/image/2402/Rosette_Patel_4974.jpg",
    mediaType: "image",
    date: new Date().toISOString().split('T')[0],
    copyright: "NASA APOD Archive"
  });

  if (isLoading) {
    return (
      <div className="relative h-[500px] rounded-2xl overflow-hidden">
        <Skeleton variant="image" className="w-full h-full" />
      </div>
    );
  }

  if (error || !apod) {
    return (
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-bg-secondary border border-white/10 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Failed to load today's image</p>
          <p className="text-sm text-muted-gray">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
    >
      {/* Background Image - Stabilized */}
      <div className="absolute inset-0 z-0">
        {apod.mediaType === 'image' ? (
          <>
            <img
              src={apod.url}
              alt={apod.title}
              // REMOVED: group-hover classes that caused flickering
              className="w-full h-full object-cover opacity-50" 
              loading="eager" // Hero images should load immediately
            />
            {/* Darker gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
          </>
        ) : apod.mediaType === 'video' ? (
          <iframe
            src={apod.url}
            title={apod.title}
            className="w-full h-full opacity-60"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 backdrop-blur-md rounded-full mb-4 border border-cyan-500/20">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
              {formatDate(apod.date, 'PPPP')}
            </span>
            {isFallback && (
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider ml-2 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                Archived
              </span>
            )}
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {apod.title}
          </h2>

          <p className="text-slate-300 leading-relaxed mb-6 line-clamp-2 text-lg">
            {apod.explanation}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowFullArticle(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-cyan-400 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              Full Article
            </button>
            
            <button
              onClick={async () => {
                setShowSimple(!showSimple);
                if (!simplifiedText && !showSimple) {
                  setIsSimplifying(true);
                  try {
                    const result = await simplifyText(apod.explanation, 'astronomy picture');
                    // Ensure result is a string before setting
                    setSimplifiedText(typeof result === 'object' ? result.simplified : result);
                  } catch (error) {
                    setSimplifiedText('AI service unavailable. Using original text.');
                  } finally {
                    setIsSimplifying(false);
                  }
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${isSimplifying ? 'animate-pulse' : ''}`} />
              {showSimple ? 'Original View' : 'Explain Simply'}
            </button>
          </div>

          {showSimple && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 bg-cyan-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            >
              {isSimplifying ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Processing Cosmic Data...</span>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-2">Simplified Perspective</div>
                  <p className="text-slate-200 leading-relaxed italic">
                    "{simplifiedText}"
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Full Article Modal */}
      <Modal 
        isOpen={showFullArticle} 
        onClose={() => setShowFullArticle(false)} 
        title={apod.title}
      >
        <div className="space-y-6">
          {apod.mediaType === 'image' ? (
            <img 
              src={apod.hdurl || apod.url} 
              alt={apod.title} 
              className="w-full rounded-2xl shadow-lg"
              onError={(e) => {
                if (e.target.src !== apod.url) {
                  e.target.src = apod.url;
                }
              }}
            />
          ) : apod.mediaType === 'video' ? (
            <div className="relative w-full aspect-video">
              <iframe
                src={apod.url}
                title={apod.title}
                className="w-full h-full rounded-2xl"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : null}
          
          <p className="text-slate-300 leading-relaxed text-lg">
            {apod.explanation}
          </p>
          
          {apod.copyright && (
            <p className="text-xs text-slate-500">
              © {apod.copyright}
            </p>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}

export { APODHero };
