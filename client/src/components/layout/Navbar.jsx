import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-lg border-b border-white/10 z-40">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold font-heading gradient-text">
            AstroView
          </h1>
        </Link>

        {/* Menu Button (for future drawer/menu functionality) */}
        <button
          className="p-2 rounded-lg text-muted-gray hover:text-star-white hover:bg-bg-tertiary transition-colors duration-200"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

export { Navbar };
