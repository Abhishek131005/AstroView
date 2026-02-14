import { Link } from 'react-router-dom';
import { ExternalLink, Heart } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const apiCredits = [
    { name: 'NASA', url: 'https://api.nasa.gov/' },
    { name: 'N2YO', url: 'https://www.n2yo.com/' },
    { name: 'Open Notify', url: 'http://open-notify.org/' },
  ];

  const internalLinks = [
    { name: 'Calendar', path: '/calendar' },
    { name: 'About', path: '/about' },
  ];

  return (
    <footer className="mt-16 border-t border-white/10 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* API Credits */}
          <div>
            <h3 className="text-sm font-semibold text-muted-gray uppercase tracking-wide mb-3">
              Powered By
            </h3>
            <div className="flex flex-wrap gap-4">
              {apiCredits.map((api) => (
                <a
                  key={api.name}
                  href={api.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-electric-blue hover:text-cosmic-purple transition-colors duration-200"
                >
                  {api.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Internal Links */}
          <div>
            <h3 className="text-sm font-semibold text-muted-gray uppercase tracking-wide mb-3">
              Explore
            </h3>
            <div className="flex flex-wrap gap-4">
              {internalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-electric-blue hover:text-cosmic-purple transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright and Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-sm text-muted-gray">
            © {currentYear} AstroView. Built for space enthusiasts.
          </p>
          
          <p className="flex items-center gap-1.5 text-sm text-muted-gray">
            Made with <Heart className="w-4 h-4 text-danger-red fill-danger-red" /> for the cosmos
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
