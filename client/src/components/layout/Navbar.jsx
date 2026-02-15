import { Link } from 'react-router-dom';

import { NotificationCenter } from '../common/NotificationCenter';
import { SettingsMenu } from '../common/SettingsMenu';

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

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <SettingsMenu />
        </div>
      </div>
    </nav>
  );
}

export { Navbar };
