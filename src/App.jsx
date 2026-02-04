import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastProvider } from './components/ui/Toast';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PromptFlow from './components/tools/PromptFlow';

// Placeholder pages for other tools
function N8nVisualizerPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">n8n Workflow Visualizer</h1>
        <p className="text-gray-400 mb-8">
          Paste your n8n workflow JSON to visualize it as an interactive flowchart.
        </p>
        <div className="card p-8">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function VideoScriptPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">AI Video Script Generator</h1>
        <p className="text-gray-400 mb-8">
          Generate complete video scripts with scene breakdowns and VEO3/SORA prompts.
        </p>
        <div className="card p-8">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function SocialConverterPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Social Post Converter</h1>
        <p className="text-gray-400 mb-8">
          Convert one post into optimized versions for all social platforms.
        </p>
        <div className="card p-8">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

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
              <Route path="/tools/n8n-visualizer" element={<N8nVisualizerPage />} />
              <Route path="/tools/video-script" element={<VideoScriptPage />} />
              <Route path="/tools/social-converter" element={<SocialConverterPage />} />
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
