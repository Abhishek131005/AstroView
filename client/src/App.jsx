import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Layout } from '@/components/layout/Layout';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { Skeleton } from '@/components/common/Skeleton';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const TrackerPage = lazy(() => import('@/pages/TrackerPage').then(m => ({ default: m.TrackerPage })));
const MissionsPage = lazy(() => import('@/pages/MissionsPage').then(m => ({ default: m.MissionsPage })));
const ImpactPage = lazy(() => import('@/pages/ImpactPage').then(m => ({ default: m.ImpactPage })));
const LearnPage = lazy(() => import('@/pages/LearnPage').then(m => ({ default: m.LearnPage })));
const CalendarPage = lazy(() => import('@/pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <Skeleton variant="text" className="w-64 h-10 mb-4" />
      <Skeleton variant="card" className="w-full h-96 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="card" className="h-64" />
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.href = '/'}
    >
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/tracker"
            element={
              <Suspense fallback={<PageLoader />}>
                <TrackerPage />
              </Suspense>
            }
          />
          <Route
            path="/missions"
            element={
              <Suspense fallback={<PageLoader />}>
                <MissionsPage />
              </Suspense>
            }
          />
          <Route
            path="/impact"
            element={
              <Suspense fallback={<PageLoader />}>
                <ImpactPage />
              </Suspense>
            }
          />
          <Route
            path="/learn"
            element={
              <Suspense fallback={<PageLoader />}>
                <LearnPage />
              </Suspense>
            }
          />
          <Route
            path="/calendar"
            element={
              <Suspense fallback={<PageLoader />}>
                <CalendarPage />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<PageLoader />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export { App };
