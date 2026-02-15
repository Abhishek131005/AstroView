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
    <footer className="mt-auto border-t border-white/10 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* API Credits */}
          <div>
            <h3 className="text-xs font-semibold text-muted-gray uppercase tracking-wide mb-2">
              Powered By
            </h3>
            <div className="flex flex-wrap gap-3">
              {apiCredits.map((api) => (
                <a
                  key={api.name}
                  href={api.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-electric-blue hover:text-cosmic-purple transition-colors duration-200"
                >
                  {api.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Internal Links */}
          <div>
            <h3 className="text-xs font-semibold text-muted-gray uppercase tracking-wide mb-2">
              Explore
            </h3>
            <div className="flex flex-wrap gap-3">
              {internalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs text-electric-blue hover:text-cosmic-purple transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright and Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/10">
          <p className="text-xs text-muted-gray">
            © {currentYear} AstroView. Built for space enthusiasts.
          </p>
          
          <p className="flex items-center gap-1.5 text-xs text-muted-gray">
            Made with <Heart className="w-3 h-3 text-danger-red fill-danger-red" /> for the cosmos
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
