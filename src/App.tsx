import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';

const GenerateCoversPage = lazy(() => import('./pages/GenerateCoversPage'));

const PageFallback: React.FC = () => (
  <div className="min-h-screen bg-[#080808] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
  </div>
);

export function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/project/:id" element={<WatchPage />} />
        <Route path="/generate-covers" element={<GenerateCoversPage />} />
        <Route path="/generate-thumbnails" element={<GenerateCoversPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
