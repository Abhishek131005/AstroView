import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { TrackerPage } from '@/pages/TrackerPage';
import { MissionsPage } from '@/pages/MissionsPage';
import { ImpactPage } from '@/pages/ImpactPage';
import { LearnPage } from '@/pages/LearnPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export { App };
