import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ResourcesPage from './pages/ResourcesPage';
import ToolsPage from './pages/ToolsPage';
import MathPage from './pages/MathPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
      <Navbar />
      <div className="flex-1">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/math" element={<MathPage />} />
          </Routes>
        </Layout>
      </div>
      <Footer />
    </div>
  );
}
