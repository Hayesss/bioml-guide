import { useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';
import SearchModal from './components/SearchModal';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const MathPage = lazy(() => import('./pages/MathPage'));
const CheatSheetPage = lazy(() => import('./pages/CheatSheetPage'));
const TopicLearnPage = lazy(() => import('./pages/TopicLearnPage'));
const IntroPage = lazy(() => import('./pages/IntroPage'));
const BioinfoNgsPage = lazy(() => import('./pages/BioinfoNgsPage'));
const FoundationModelsPage = lazy(() => import('./pages/FoundationModelsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onSearch={openSearch} />
      <SearchModal isOpen={searchOpen} onClose={closeSearch} onToggle={toggleSearch} />
      <div className="flex-1">
        <Layout>
          <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/ngs" element={<BioinfoNgsPage />} />
            <Route path="/foundation-models" element={<FoundationModelsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/math" element={<MathPage />} />
            <Route path="/cheatsheet" element={<CheatSheetPage />} />
            <Route path="/learn/:topicKey" element={<TopicLearnPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
        </Layout>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
