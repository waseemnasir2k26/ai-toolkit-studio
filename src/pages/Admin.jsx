import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  TrendingUp,
  Wand2,
  FileCode,
  Video,
  Share2,
  Download,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Sparkles,
  Brain,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Label } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal, ModalFooter } from '../components/ui/Modal';
import { GlowingCard } from '../components/ui/GlowingCard';
import { useToast } from '../components/ui/Toast';
import { cn, generateId, getStorageItem, setStorageItem, formatDate, downloadAsFile } from '../lib/utils';

// Stats data
const initialStats = [
  { label: 'Total Tools', value: '4', change: '+2', icon: Wand2, color: 'violet' },
  { label: 'Active Prompts', value: '24', change: '+8', icon: Brain, color: 'cyan' },
  { label: 'Sessions Today', value: '156', change: '+23%', icon: Activity, color: 'emerald' },
  { label: 'Avg. Chain Length', value: '3.2', change: '+0.4', icon: Target, color: 'amber' },
];

// Tool configs
const toolConfigs = [
  { id: 'prompt-flow', name: 'Prompt Flow', icon: Wand2, status: 'active', uses: 1234 },
  { id: 'n8n-visualizer', name: 'n8n Visualizer', icon: FileCode, status: 'active', uses: 856 },
  { id: 'video-script', name: 'Video Script AI', icon: Video, status: 'active', uses: 623 },
  { id: 'social-converter', name: 'Social Converter', icon: Share2, status: 'active', uses: 445 },
];

// Prompt Templates Management
const defaultPromptTemplates = [
  {
    id: '1',
    name: 'Summarize',
    category: 'Content',
    prompt: 'Summarize the following text in 2-3 sentences:\n\n{{input}}',
    description: 'Creates a brief summary of the input text',
    uses: 523,
  },
  {
    id: '2',
    name: 'Bullet Points',
    category: 'Content',
    prompt: 'Convert this into bullet points:\n\n{{input}}',
    description: 'Extracts key points as bullet list',
    uses: 412,
  },
  {
    id: '3',
    name: 'Translate Spanish',
    category: 'Translation',
    prompt: 'Translate to Spanish:\n\n{{input}}',
    description: 'Translates text to Spanish',
    uses: 298,
  },
  {
    id: '4',
    name: 'Make Formal',
    category: 'Tone',
    prompt: 'Rewrite in a professional, formal tone:\n\n{{input}}',
    description: 'Converts to professional writing style',
    uses: 267,
  },
  {
    id: '5',
    name: 'Generate Questions',
    category: 'Educational',
    prompt: 'Generate 5 quiz questions based on:\n\n{{input}}',
    description: 'Creates quiz questions from content',
    uses: 189,
  },
];

// Activity Log
const defaultActivityLog = [
  { id: '1', action: 'Prompt Created', tool: 'Prompt Flow', user: 'Admin', time: new Date().toISOString() },
  { id: '2', action: 'Chain Executed', tool: 'Prompt Flow', user: 'User', time: new Date(Date.now() - 300000).toISOString() },
  { id: '3', action: 'Template Updated', tool: 'Admin', user: 'Admin', time: new Date(Date.now() - 600000).toISOString() },
  { id: '4', action: 'Workflow Visualized', tool: 'n8n Visualizer', user: 'User', time: new Date(Date.now() - 900000).toISOString() },
  { id: '5', action: 'Script Generated', tool: 'Video Script AI', user: 'User', time: new Date(Date.now() - 1200000).toISOString() },
];

// Stat Card Component
function StatCard({ stat }) {
  const Icon = stat.icon;
  const colors = {
    violet: 'from-violet-500/20 to-violet-600/10 text-violet-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/10 text-amber-400',
  };

  return (
    <GlowingCard>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
          </div>
          <div className={cn('p-3 rounded-xl bg-gradient-to-br', colors[stat.color])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">{stat.change}</span>
          <span className="text-sm text-gray-500">vs last week</span>
        </div>
      </div>
    </GlowingCard>
  );
}

// Prompt Template Editor Modal
function PromptTemplateModal({ isOpen, onClose, template, onSave }) {
  const [formData, setFormData] = useState(template || {
    name: '',
    category: 'Content',
    prompt: '',
    description: '',
  });

  useEffect(() => {
    if (template) {
      setFormData(template);
    } else {
      setFormData({ name: '', category: 'Content', prompt: '', description: '' });
    }
  }, [template]);

  const handleSave = () => {
    onSave({
      ...formData,
      id: formData.id || generateId(),
      uses: formData.uses || 0,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template ? 'Edit Prompt Template' : 'Create Prompt Template'}
      description="Configure the prompt template that users can quickly apply"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label required>Template Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Summarize"
            />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="input"
            >
              <option value="Content">Content</option>
              <option value="Translation">Translation</option>
              <option value="Tone">Tone</option>
              <option value="Educational">Educational</option>
              <option value="Code">Code</option>
              <option value="Creative">Creative</option>
            </select>
          </div>
        </div>

        <div>
          <Label required>Prompt Template</Label>
          <Textarea
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="Enter your prompt template. Use {{input}} to reference the input text."
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Use <code className="px-1.5 py-0.5 bg-dark-600 rounded text-brand-400">{'{{input}}'}</code> to reference the previous step's output
          </p>
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of what this template does"
          />
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon={Save} onClick={handleSave}>
          {template ? 'Save Changes' : 'Create Template'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Main Admin Dashboard
export default function Admin() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState(() => {
    return getStorageItem('admin_templates') || defaultPromptTemplates;
  });
  const [activityLog, setActivityLog] = useState(defaultActivityLog);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Save templates to storage
  useEffect(() => {
    setStorageItem('admin_templates', templates);
  }, [templates]);

  // Handle template save
  const handleSaveTemplate = (template) => {
    setTemplates(prev => {
      const exists = prev.find(t => t.id === template.id);
      if (exists) {
        return prev.map(t => t.id === template.id ? template : t);
      }
      return [...prev, template];
    });
    toast.success('Template Saved', `"${template.name}" has been saved successfully.`);

    // Add to activity log
    setActivityLog(prev => [{
      id: generateId(),
      action: editingTemplate ? 'Template Updated' : 'Template Created',
      tool: 'Admin',
      user: 'Admin',
      time: new Date().toISOString(),
    }, ...prev].slice(0, 20));
  };

  // Delete template
  const handleDeleteTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success('Template Deleted', `"${template?.name}" has been deleted.`);
  };

  // Export templates
  const handleExportTemplates = () => {
    const data = JSON.stringify(templates, null, 2);
    downloadAsFile(data, 'prompt-templates.json', 'application/json');
    toast.success('Exported', 'Templates exported successfully.');
  };

  // Filter templates
  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'templates', label: 'Prompt Templates', icon: Brain },
    { id: 'tools', label: 'Tools Config', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-brand-400" />
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Train prompts, configure tools, and monitor usage
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => toast.info('Refreshed', 'Dashboard data updated.')}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportTemplates}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-dark-800/50 rounded-xl mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {initialStats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <GlowingCard
                className="cursor-pointer"
                onClick={() => {
                  setActiveTab('templates');
                  setEditingTemplate(null);
                  setIsTemplateModalOpen(true);
                }}
              >
                <div className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-brand-500/20">
                    <Plus className="w-6 h-6 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Create Template</h3>
                    <p className="text-sm text-gray-400">Add a new prompt template</p>
                  </div>
                </div>
              </GlowingCard>

              <GlowingCard
                className="cursor-pointer"
                onClick={() => setActiveTab('tools')}
              >
                <div className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-500/20">
                    <Settings className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Configure Tools</h3>
                    <p className="text-sm text-gray-400">Manage tool settings</p>
                  </div>
                </div>
              </GlowingCard>

              <GlowingCard
                className="cursor-pointer"
                onClick={() => setActiveTab('activity')}
              >
                <div className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20">
                    <Activity className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">View Activity</h3>
                    <p className="text-sm text-gray-400">Monitor usage logs</p>
                  </div>
                </div>
              </GlowingCard>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activityLog.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-sm text-white">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.tool}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{item.user}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="pl-10"
                />
              </div>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setEditingTemplate(null);
                  setIsTemplateModalOpen(true);
                }}
              >
                New Template
              </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card p-5 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <Badge variant="secondary" size="sm" className="mt-1">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setIsTemplateModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>

                  <div className="p-3 rounded-lg bg-dark-700/50 font-mono text-xs text-gray-500 line-clamp-2">
                    {template.prompt}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-600/50">
                    <span className="text-xs text-gray-500">
                      <Zap className="w-3 h-3 inline mr-1" />
                      {template.uses} uses
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tools Config Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {toolConfigs.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.id} className="card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-brand-500/20">
                          <Icon className="w-6 h-6 text-brand-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{tool.name}</h3>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {tool.uses.toLocaleString()} total uses
                          </p>
                        </div>
                      </div>
                      <Badge variant={tool.status === 'active' ? 'success' : 'warning'}>
                        {tool.status}
                      </Badge>
                    </div>

                    <div className="mt-6 pt-4 border-t border-dark-600/50 flex gap-2">
                      <Button variant="secondary" size="sm" icon={Settings}>
                        Configure
                      </Button>
                      <Button variant="ghost" size="sm" icon={Activity}>
                        Analytics
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-dark-600/50">
              <h3 className="font-semibold text-white">Activity Log</h3>
            </div>
            <div className="divide-y divide-dark-600/30">
              {activityLog.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-dark-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.action}</p>
                      <p className="text-sm text-gray-400">{item.tool}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">{item.user}</p>
                    <p className="text-xs text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDate(item.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Modal */}
        <PromptTemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => {
            setIsTemplateModalOpen(false);
            setEditingTemplate(null);
          }}
          template={editingTemplate}
          onSave={handleSaveTemplate}
        />
      </div>
    </div>
  );
}
