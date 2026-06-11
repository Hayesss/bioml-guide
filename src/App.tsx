import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';
import SearchModal from './components/SearchModal';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ResourcesPage from './pages/ResourcesPage';
import ToolsPage from './pages/ToolsPage';
import MathPage from './pages/MathPage';
import CheatSheetPage from './pages/CheatSheetPage';
import TopicLearnPage from './pages/TopicLearnPage';
import IntroPage from './pages/IntroPage';
import BioinfoNgsPage from './pages/BioinfoNgsPage';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
      <Navbar onSearch={openSearch} />
      <SearchModal isOpen={searchOpen} onClose={closeSearch} onToggle={toggleSearch} />
      <div className="flex-1">
        <Layout>
          <ErrorBoundary>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/ngs" element={<BioinfoNgsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/math" element={<MathPage />} />
            <Route path="/cheatsheet" element={<CheatSheetPage />} />
            <Route path="/learn/:topicKey" element={<TopicLearnPage />} />
          </Routes>
          </ErrorBoundary>
        </Layout>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
