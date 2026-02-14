import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 404 Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-electric-blue/10 mb-6">
          <AlertCircle className="w-10 h-10 text-electric-blue" />
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-bold font-heading gradient-text mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold font-heading text-star-white mb-3">
          Lost in Space
        </h2>
        
        <p className="text-muted-gray mb-8">
          This page seems to have drifted into the void. Let's get you back to familiar territory.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Link to="/tracker">
            <Button variant="secondary">
              Explore Tracker
            </Button>
          </Link>
        </div>

        {/* Fun space fact */}
        <p className="mt-12 text-sm text-faint-gray italic">
          Did you know? Space is completely silent because there's no air to carry sound waves.
        </p>
      </motion.div>
    </div>
  );
}

export { NotFoundPage };
