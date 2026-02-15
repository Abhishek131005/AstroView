import { motion } from 'framer-motion';
import { Info, ExternalLink } from 'lucide-react';
import { Card } from '@/components/common/Card';

function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Info className="w-7 h-7 text-electric-blue" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-star-white">
            About AstroView
          </h1>
          <p className="text-muted-gray text-sm mt-0.5">
            Making space data accessible to everyone
          </p>
        </div>
      </div>

      {/* Mission */}
      <Card>
        <h2 className="text-xl font-bold font-heading text-star-white mb-2">
          Our Mission
        </h2>
        <p className="text-muted-gray leading-relaxed text-sm">
          AstroView transforms complex space data into meaningful, accessible insights for everyday users. 
          We believe everyone should be able to explore and understand what's happening in space, 
          regardless of their scientific background.
        </p>
      </Card>

      {/* Features */}
      <Card>
        <h2 className="text-xl font-bold font-heading text-star-white mb-3">
          What We Offer
        </h2>
        <ul className="space-y-2 text-muted-gray text-sm">
          <li className="flex items-start gap-2">
            <span className="text-electric-blue mt-1">•</span>
            <span>Real-time satellite tracking and ISS location</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-electric-blue mt-1">•</span>
            <span>Current and upcoming space missions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-electric-blue mt-1">•</span>
            <span>Natural events monitoring (asteroids, solar storms)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-electric-blue mt-1">•</span>
            <span>AI-powered explanations in simple language</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-electric-blue mt-1">•</span>
            <span>Interactive space calendar and alerts</span>
          </li>
        </ul>
      </Card>

      {/* Data Sources */}
      <Card>
        <h2 className="text-2xl font-bold font-heading text-star-white mb-4">
          Data Sources
        </h2>
        <div className="space-y-2">
          {[
            { name: 'NASA Open APIs', url: 'https://api.nasa.gov/' },
            { name: 'N2YO Satellite Database', url: 'https://www.n2yo.com/' },
            { name: 'Open Notify', url: 'http://open-notify.org/' },
            { name: 'Astronomy API', url: 'https://astronomyapi.com/' },
          ].map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-electric-blue hover:text-cosmic-purple transition-colors duration-200"
            >
              {source.name}
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      </Card>

      {/* Credits */}
      <Card>
        <h2 className="text-2xl font-bold font-heading text-star-white mb-3">
          Built For
        </h2>
        <p className="text-muted-gray">
          A 24-hour hackathon project created to make space exploration accessible to students, 
          educators, and space enthusiasts worldwide. Designed for ages 14+ with no science background required.
        </p>
      </Card>
    </motion.div>
  );
}

export { AboutPage };
