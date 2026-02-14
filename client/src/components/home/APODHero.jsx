import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Loader2 } from 'lucide-react';
import { getAPOD } from '@/services/nasaService';
import Skeleton from '@/components/common/Skeleton';
import { formatDate } from '@/utils/formatters';

function APODHero() {
  const [apod, setApod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSimple, setShowSimple] = useState(false);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const data = await getAPOD();
        setApod(data);
      } catch (err) {
        setError(err.message || 'Failed to load Astronomy Picture of the Day');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  if (isLoading) {
    return (
      <div className="relative h-[500px] rounded-2xl overflow-hidden">
        <Skeleton variant="image" className="w-full h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-bg-secondary border border-white/10 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">Failed to load today's image</p>
          <p className="text-sm text-muted-gray">{error}</p>
        </div>
      </div>
    );
  }

  if (!apod) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[500px] rounded-2xl overflow-hidden group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {apod.media_type === 'image' ? (
          <img
            src={apod.url}
            alt={apod.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : apod.media_type === 'video' ? (
          <iframe
            src={apod.url}
            title={apod.title}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cosmic-purple/20 to-electric-blue/20 flex items-center justify-center">
            <p className="text-muted-gray">Media type not supported</p>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg mb-3 border border-white/20">
            <Calendar className="w-4 h-4 text-electric-blue" />
            <span className="text-sm text-white font-medium">
              {formatDate(apod.date, 'PPPP')}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 max-w-3xl">
            {apod.title}
          </h2>

          {/* Description */}
          <div className="max-w-3xl">
            <p className="text-gray-200 leading-relaxed mb-3 line-clamp-3">
              {apod.explanation}
            </p>

            {/* Explain Simply Toggle */}
            <button
              onClick={() => setShowSimple(!showSimple)}
              className="inline-flex items-center gap-2 text-sm text-electric-blue hover:text-electric-blue/80 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {showSimple ? 'Show Original' : 'Explain Simply'}
            </button>

            {showSimple && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-electric-blue" />
                  <span className="text-sm text-white">Loading simplified explanation...</span>
                </div>
                <p className="text-sm text-gray-300">
                  AI simplification feature coming soon! For now, here's the original description.
                </p>
              </motion.div>
            )}
          </div>

          {/* Copyright */}
          {apod.copyright && (
            <p className="text-xs text-muted-gray mt-3">
              © {apod.copyright}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export { APODHero };
