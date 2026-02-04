import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Simple Toast Context
import { createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
    };
  }
  return context;
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-lg shadow-lg ${
              t.type === 'success' ? 'bg-green-500' :
              t.type === 'error' ? 'bg-red-500' :
              t.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
            } text-white`}
          >
            <p className="font-bold">{t.title}</p>
            <p className="text-sm">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Simple Header
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-white">AI ToolKit Studio</a>
        <nav className="flex gap-4">
          <a href="/tools/prompt-flow" className="text-gray-300 hover:text-white">Prompt Flow</a>
          <a href="/tools/n8n-visualizer" className="text-gray-300 hover:text-white">n8n Visualizer</a>
          <a href="/tools/video-script" className="text-gray-300 hover:text-white">Video Script</a>
          <a href="/tools/social-converter" className="text-gray-300 hover:text-white">Social Converter</a>
        </nav>
      </div>
    </header>
  );
}

// Simple Footer
function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
      <p>© 2024 AI ToolKit Studio</p>
    </footer>
  );
}

// Home Page
function Home() {
  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6">AI ToolKit Studio</h1>
        <p className="text-xl text-gray-400 mb-8">Powerful AI tools for creators</p>
        <div className="grid grid-cols-2 gap-4">
          <a href="/tools/prompt-flow" className="p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
            <h3 className="text-lg font-semibold text-white">Prompt Flow</h3>
            <p className="text-gray-400 text-sm">Visual prompt chain builder</p>
          </a>
          <a href="/tools/n8n-visualizer" className="p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
            <h3 className="text-lg font-semibold text-white">n8n Visualizer</h3>
            <p className="text-gray-400 text-sm">Workflow JSON visualizer</p>
          </a>
          <a href="/tools/video-script" className="p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
            <h3 className="text-lg font-semibold text-white">Video Script AI</h3>
            <p className="text-gray-400 text-sm">Generate video scripts</p>
          </a>
          <a href="/tools/social-converter" className="p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
            <h3 className="text-lg font-semibold text-white">Social Converter</h3>
            <p className="text-gray-400 text-sm">Convert posts for platforms</p>
          </a>
        </div>
      </div>
    </div>
  );
}

// Prompt Flow Tool
function PromptFlow() {
  const toast = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) {
      toast.error('Error', 'Please enter some text');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setOutput(`Processed: ${input}\n\nThis is a simulated AI response. The text has been analyzed and processed.`);
    toast.success('Success', 'Text processed!');
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Prompt Flow</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="Enter your text..."
            />
            <button
              onClick={handleProcess}
              disabled={loading}
              className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-semibold rounded-lg"
            >
              {loading ? 'Processing...' : 'Process'}
            </button>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Output</label>
            <div className="w-full h-64 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white overflow-auto">
              {output || <span className="text-gray-500">Output will appear here...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// N8n Visualizer Tool
function N8nVisualizer() {
  const toast = useToast();
  const [json, setJson] = useState('');
  const [parsed, setParsed] = useState(null);

  const handleParse = () => {
    if (!json.trim()) {
      toast.error('Error', 'Please paste your n8n workflow JSON');
      return;
    }
    try {
      const data = JSON.parse(json);
      if (!data.nodes) throw new Error('Invalid workflow');
      setParsed(data);
      toast.success('Success', 'Workflow parsed!');
    } catch (e) {
      toast.error('Error', 'Invalid JSON: ' + e.message);
    }
  };

  const loadSample = () => {
    const sample = {
      name: "Sample Workflow",
      nodes: [
        { id: "1", name: "Webhook", type: "webhook", position: [100, 100] },
        { id: "2", name: "Process", type: "function", position: [300, 100] },
        { id: "3", name: "Send Email", type: "email", position: [500, 100] }
      ]
    };
    setJson(JSON.stringify(sample, null, 2));
    setParsed(sample);
    toast.info('Loaded', 'Sample workflow loaded');
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">n8n Workflow Visualizer</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-300">Workflow JSON</label>
              <button onClick={loadSample} className="text-indigo-400 text-sm hover:underline">Load Sample</button>
            </div>
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="w-full h-64 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
              placeholder='{"name": "...", "nodes": [...]}'
            />
            <button
              onClick={handleParse}
              className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
            >
              Visualize
            </button>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-gray-300 mb-2">Visualization</label>
            <div className="w-full h-80 p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-auto">
              {parsed ? (
                <div>
                  <h3 className="text-white font-semibold mb-4">{parsed.name}</h3>
                  <div className="flex flex-wrap gap-4">
                    {parsed.nodes?.map((node, i) => (
                      <div key={i} className="p-4 bg-gray-700 rounded-lg min-w-[120px]">
                        <p className="text-white font-medium">{node.name}</p>
                        <p className="text-gray-400 text-xs">{node.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Paste JSON and click Visualize</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Script Generator
function VideoScriptGenerator() {
  const toast = useToast();
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Error', 'Please enter a video topic');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setScript({
      title: `${topic} - Video Script`,
      scenes: [
        { number: 1, type: 'Hook', content: `Open with attention-grabbing intro about ${topic}` },
        { number: 2, type: 'Problem', content: `Present the challenge or question about ${topic}` },
        { number: 3, type: 'Solution', content: `Reveal the key insight about ${topic}` },
        { number: 4, type: 'CTA', content: `Call to action - subscribe, like, comment` },
      ]
    });
    toast.success('Success', 'Script generated!');
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Video Script Generator</h1>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Video Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., How to build a website in 10 minutes"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-semibold rounded-lg"
          >
            {loading ? 'Generating...' : 'Generate Script'}
          </button>
        </div>
        {script && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{script.title}</h2>
            <div className="space-y-4">
              {script.scenes.map((scene) => (
                <div key={scene.number} className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-indigo-400 font-semibold">Scene {scene.number}: {scene.type}</p>
                  <p className="text-gray-300 mt-2">{scene.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Social Converter
function SocialConverter() {
  const toast = useToast();
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) {
      toast.error('Error', 'Please enter your post content');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setOutputs({
      twitter: input.slice(0, 280) + (input.length > 280 ? '...' : ''),
      linkedin: `${input}\n\n#professional #insights #business`,
      instagram: `${input}\n\n✨ Double tap if you agree! 💯\n\n#content #viral #trending`,
    });
    toast.success('Success', 'Posts converted!');
    setLoading(false);
  };

  const copyToClipboard = (text, platform) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied', `${platform} post copied!`);
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Social Post Converter</h1>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Your Post</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="Enter your post content..."
          />
          <button
            onClick={handleConvert}
            disabled={loading}
            className="mt-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-semibold rounded-lg"
          >
            {loading ? 'Converting...' : 'Convert for All Platforms'}
          </button>
        </div>
        {outputs && (
          <div className="space-y-4">
            {Object.entries(outputs).map(([platform, text]) => (
              <div key={platform} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-semibold capitalize">{platform}</h3>
                  <button
                    onClick={() => copyToClipboard(text, platform)}
                    className="text-indigo-400 text-sm hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="pt-24 pb-12 px-4 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-gray-400 mb-8">Page not found</p>
      <a href="/" className="text-indigo-400 hover:underline">Go Home</a>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
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
