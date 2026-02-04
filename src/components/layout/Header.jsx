import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Wand2,
  FileCode,
  Video,
  Share2,
  LayoutDashboard,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const tools = [
  { name: 'Prompt Flow', path: '/tools/prompt-flow', icon: Wand2, description: 'Visual prompt chain builder' },
  { name: 'n8n Visualizer', path: '/tools/n8n-visualizer', icon: FileCode, description: 'Workflow JSON visualizer' },
  { name: 'Video Script AI', path: '/tools/video-script', icon: Video, description: 'AI video script generator' },
  { name: 'Social Converter', path: '/tools/social-converter', icon: Share2, description: 'Multi-platform converter' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Glass background */}
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-xl border-b border-white/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-white">AI ToolKit</span>
              <span className="font-display font-bold text-lg gradient-text ml-1">Studio</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  toolsDropdownOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white'
                )}
              >
                Tools
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform',
                  toolsDropdownOpen && 'rotate-180'
                )} />
              </button>

              <AnimatePresence>
                {toolsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-72 p-2 rounded-xl bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 shadow-xl"
                  >
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = location.pathname === tool.path;

                      return (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-lg transition-all',
                            isActive
                              ? 'bg-brand-500/10 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <div className={cn(
                            'p-2 rounded-lg',
                            isActive ? 'bg-brand-500/20 text-brand-400' : 'bg-dark-600/50'
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tool.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{tool.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/admin"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                location.pathname === '/admin'
                  ? 'text-white bg-white/5'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Admin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" className="hidden sm:flex">
              Get Started
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-dark-900/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tool.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-dark-600/50 mt-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
