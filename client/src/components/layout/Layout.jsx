import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Navbar - visible on all screen sizes */}
      <Navbar />

      {/* Desktop Layout - Sidebar + Content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-64">
          <main className="flex-1 pb-16 lg:pb-6 pt-14">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
              <Outlet />
            </div>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation - visible only on mobile */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

export { Layout };
