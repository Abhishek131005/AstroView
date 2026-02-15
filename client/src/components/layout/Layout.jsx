import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navbar - visible on all screen sizes */}
      <Navbar />

      {/* Desktop Layout - Sidebar + Content */}
      <div className="flex">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen pb-20 lg:pb-8 lg:ml-64 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Outlet />
          </div>
          
          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation - visible only on mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

export { Layout };
