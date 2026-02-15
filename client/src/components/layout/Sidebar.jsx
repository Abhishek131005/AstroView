import { NavLink } from 'react-router-dom';
import { Home, Satellite, Rocket, Globe, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Tonight\'s Sky', icon: Home },
  { path: '/tracker', label: 'Live Tracker', icon: Satellite },
  { path: '/missions', label: 'Mission Control', icon: Rocket },
  { path: '/impact', label: 'Space to Earth', icon: Globe },
  { path: '/learn', label: 'Learn & Explore', icon: GraduationCap },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-bg-secondary border-r border-white/10 flex flex-col">
      {/* Navigation */}
      <nav className="flex-1 p-4 pt-6 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-electric-blue to-cosmic-purple text-white shadow-lg'
                      : 'text-muted-gray hover:text-star-white hover:bg-bg-tertiary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-faint-gray text-center">
          Made with 💫 for space enthusiasts
        </p>
      </div>
    </aside>
  );
}

export { Sidebar };
