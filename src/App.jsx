import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastProvider } from './components/ui/Toast';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PromptFlow from './components/tools/PromptFlow';
import N8nVisualizer from './components/tools/N8nVisualizer';
import VideoScriptGenerator from './components/tools/VideoScriptGenerator';
import SocialConverter from './components/tools/SocialConverter';

function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <a href="/" className="btn-primary">
          Go Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-dark-950 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tools/prompt-flow" element={<PromptFlow />} />
              <Route path="/tools/n8n-visualizer" element={<N8nVisualizer />} />
              <Route path="/tools/video-script" element={<VideoScriptGenerator />} />
              <Route path="/tools/social-converter" element={<SocialConverter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
