import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode,
  Upload,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Play,
  GitBranch,
  Database,
  Globe,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Webhook,
  Clock,
  Filter,
  Zap,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Button, IconButton } from '../ui/Button';
import { GlowingCard } from '../ui/GlowingCard';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

// Node type icons and colors
const nodeConfig = {
  'n8n-nodes-base.webhook': { icon: Webhook, color: 'from-purple-500 to-violet-600', label: 'Webhook' },
  'n8n-nodes-base.httpRequest': { icon: Globe, color: 'from-blue-500 to-cyan-600', label: 'HTTP Request' },
  'n8n-nodes-base.function': { icon: FileCode, color: 'from-amber-500 to-orange-600', label: 'Function' },
  'n8n-nodes-base.if': { icon: GitBranch, color: 'from-emerald-500 to-green-600', label: 'IF' },
  'n8n-nodes-base.switch': { icon: Filter, color: 'from-teal-500 to-emerald-600', label: 'Switch' },
  'n8n-nodes-base.set': { icon: Database, color: 'from-indigo-500 to-purple-600', label: 'Set' },
  'n8n-nodes-base.emailSend': { icon: Mail, color: 'from-red-500 to-pink-600', label: 'Send Email' },
  'n8n-nodes-base.slack': { icon: MessageSquare, color: 'from-purple-500 to-pink-600', label: 'Slack' },
  'n8n-nodes-base.googleSheets': { icon: FileText, color: 'from-green-500 to-emerald-600', label: 'Google Sheets' },
  'n8n-nodes-base.schedule': { icon: Clock, color: 'from-blue-500 to-indigo-600', label: 'Schedule' },
  'n8n-nodes-base.cron': { icon: Calendar, color: 'from-violet-500 to-purple-600', label: 'Cron' },
  'n8n-nodes-base.start': { icon: Play, color: 'from-green-500 to-emerald-600', label: 'Start' },
  'n8n-nodes-base.noOp': { icon: Zap, color: 'from-gray-500 to-gray-600', label: 'No Operation' },
  default: { icon: Zap, color: 'from-brand-500 to-accent-purple', label: 'Node' },
};

// Sample n8n workflow for demo
const sampleWorkflow = {
  name: "Email Notification Workflow",
  nodes: [
    {
      id: "1",
      name: "Webhook Trigger",
      type: "n8n-nodes-base.webhook",
      position: [250, 300],
      parameters: { path: "/webhook", httpMethod: "POST" }
    },
    {
      id: "2",
      name: "Process Data",
      type: "n8n-nodes-base.function",
      position: [500, 300],
      parameters: {}
    },
    {
      id: "3",
      name: "Check Condition",
      type: "n8n-nodes-base.if",
      position: [750, 300],
      parameters: { conditions: { boolean: [{ value1: "={{$json.status}}", value2: "active" }] } }
    },
    {
      id: "4",
      name: "Send Email",
      type: "n8n-nodes-base.emailSend",
      position: [1000, 200],
      parameters: { to: "user@example.com", subject: "Notification" }
    },
    {
      id: "5",
      name: "Log to Sheets",
      type: "n8n-nodes-base.googleSheets",
      position: [1000, 400],
      parameters: { operation: "append" }
    }
  ],
  connections: {
    "Webhook Trigger": { main: [[{ node: "Process Data", type: "main", index: 0 }]] },
    "Process Data": { main: [[{ node: "Check Condition", type: "main", index: 0 }]] },
    "Check Condition": {
      main: [
        [{ node: "Send Email", type: "main", index: 0 }],
        [{ node: "Log to Sheets", type: "main", index: 0 }]
      ]
    }
  }
};

function WorkflowNode({ node, isSelected, onClick, scale }) {
  const config = nodeConfig[node.type] || nodeConfig.default;
  const Icon = config.icon;

  return (
    <motion.div
      className={`absolute cursor-pointer select-none`}
      style={{
        left: node.position[0] * scale,
        top: node.position[1] * scale,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => onClick(node)}
    >
      <div
        className={`
          relative p-4 rounded-2xl bg-dark-800/90 border-2 backdrop-blur-sm
          transition-all duration-200 min-w-[140px]
          ${isSelected ? 'border-brand-500 shadow-glow' : 'border-dark-600 hover:border-dark-400'}
        `}
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-2 mx-auto`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Name */}
        <p className="text-sm font-medium text-white text-center truncate">{node.name}</p>
        <p className="text-xs text-gray-500 text-center mt-1">{config.label}</p>

        {/* Connection dots */}
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-dark-600 border-2 border-dark-400" />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-500 border-2 border-brand-400" />
      </div>
    </motion.div>
  );
}

function ConnectionLine({ from, to, scale }) {
  const startX = from.position[0] * scale + 70;
  const startY = from.position[1] * scale;
  const endX = to.position[0] * scale - 70;
  const endY = to.position[1] * scale;

  const midX = (startX + endX) / 2;
  const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke="url(#connectionGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  );
}

export default function N8nVisualizer() {
  const [jsonInput, setJsonInput] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const parseWorkflow = useCallback(() => {
    setError(null);
    setSelectedNode(null);

    if (!jsonInput.trim()) {
      setError('Please paste your n8n workflow JSON');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      // Validate it looks like an n8n workflow
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
        throw new Error('Invalid n8n workflow: missing nodes array');
      }

      // Normalize node positions if needed
      const normalizedNodes = parsed.nodes.map((node, index) => ({
        ...node,
        id: node.id || String(index + 1),
        position: node.position || [200 + index * 250, 300],
      }));

      setWorkflow({ ...parsed, nodes: normalizedNodes });
      addToast('Workflow parsed successfully!', 'success');
    } catch (err) {
      setError(`JSON Parse Error: ${err.message}`);
      addToast('Failed to parse workflow', 'error');
    }
  }, [jsonInput, addToast]);

  const loadSample = useCallback(() => {
    setJsonInput(JSON.stringify(sampleWorkflow, null, 2));
    setWorkflow(sampleWorkflow);
    setError(null);
    addToast('Sample workflow loaded', 'info');
  }, [addToast]);

  const resetView = useCallback(() => {
    setScale(1);
    setSelectedNode(null);
  }, []);

  const copyJson = useCallback(async () => {
    if (workflow) {
      await navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast('JSON copied to clipboard', 'success');
    }
  }, [workflow, addToast]);

  const downloadSvg = useCallback(() => {
    if (!workflow) return;

    const svg = document.getElementById('workflow-canvas');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workflow.name || 'workflow'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('SVG downloaded', 'success');
    }
  }, [workflow, addToast]);

  // Build connections map
  const connections = useMemo(() => {
    if (!workflow?.connections) return [];

    const result = [];
    const nodeMap = {};
    workflow.nodes.forEach(n => { nodeMap[n.name] = n; });

    Object.entries(workflow.connections).forEach(([fromName, outputs]) => {
      const fromNode = nodeMap[fromName];
      if (!fromNode || !outputs.main) return;

      outputs.main.forEach(connections => {
        connections?.forEach(conn => {
          const toNode = nodeMap[conn.node];
          if (toNode) {
            result.push({ from: fromNode, to: toNode });
          }
        });
      });
    });

    return result;
  }, [workflow]);

  // Calculate canvas bounds
  const canvasBounds = useMemo(() => {
    if (!workflow?.nodes.length) return { width: 800, height: 600 };

    let maxX = 0, maxY = 0;
    workflow.nodes.forEach(node => {
      maxX = Math.max(maxX, node.position[0]);
      maxY = Math.max(maxY, node.position[1]);
    });

    return { width: Math.max(maxX + 300, 800), height: Math.max(maxY + 200, 600) };
  }, [workflow]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="success" className="mb-4">
            <FileCode className="w-3 h-3" />
            Workflow Tool
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            n8n Workflow Visualizer
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Paste your n8n workflow JSON to visualize it as an interactive flowchart.
            Explore nodes, connections, and export as SVG.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* JSON Input Panel */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlowingCard className="h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Workflow JSON</h2>
                  <Button variant="ghost" size="sm" onClick={loadSample}>
                    Load Sample
                  </Button>
                </div>

                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"name": "My Workflow", "nodes": [...], "connections": {...}}'
                  className="w-full h-64 p-4 bg-dark-900/50 border border-dark-600/50 rounded-xl text-gray-100 font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500/50 resize-none"
                />

                {error && (
                  <motion.div
                    className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="primary" className="flex-1" onClick={parseWorkflow}>
                    <Play className="w-4 h-4" />
                    Visualize
                  </Button>
                  <IconButton
                    variant="secondary"
                    onClick={copyJson}
                    disabled={!workflow}
                    title="Copy JSON"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </IconButton>
                </div>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Visualization Canvas */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowingCard className="h-full">
              <div className="p-4 border-b border-dark-600/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    {workflow?.name || 'Workflow Canvas'}
                  </h2>
                  {workflow && (
                    <Badge variant="primary" size="sm">
                      {workflow.nodes.length} nodes
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setScale(s => Math.min(s + 0.1, 2))}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={resetView}
                    title="Reset View"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={downloadSvg}
                    disabled={!workflow}
                    title="Download SVG"
                  >
                    <Download className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>

              <div className="relative overflow-auto bg-dark-900/30 min-h-[500px]" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                {!workflow ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">Paste JSON and click Visualize</p>
                      <p className="text-gray-600 text-sm mt-2">or load the sample workflow</p>
                    </div>
                  </div>
                ) : (
                  <svg
                    id="workflow-canvas"
                    width={canvasBounds.width * scale}
                    height={canvasBounds.height * scale}
                    className="min-w-full"
                  >
                    <defs>
                      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>

                    {/* Connections */}
                    {connections.map((conn, i) => (
                      <ConnectionLine key={i} from={conn.from} to={conn.to} scale={scale} />
                    ))}
                  </svg>
                )}

                {/* Nodes overlay */}
                {workflow?.nodes.map(node => (
                  <WorkflowNode
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onClick={setSelectedNode}
                    scale={scale}
                  />
                ))}
              </div>

              {/* Selected node details */}
              <AnimatePresence>
                {selectedNode && (
                  <motion.div
                    className="p-4 border-t border-dark-600/50 bg-dark-800/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{selectedNode.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{selectedNode.type}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                        Close
                      </Button>
                    </div>
                    {selectedNode.parameters && Object.keys(selectedNode.parameters).length > 0 && (
                      <div className="mt-3 p-3 bg-dark-900/50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">Parameters</p>
                        <pre className="text-xs text-gray-300 overflow-auto">
                          {JSON.stringify(selectedNode.parameters, null, 2)}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlowingCard>
          </motion.div>
        </div>

        {/* Workflow Stats */}
        {workflow && (
          <motion.div
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { label: 'Total Nodes', value: workflow.nodes.length, icon: Zap },
              { label: 'Connections', value: connections.length, icon: GitBranch },
              { label: 'Triggers', value: workflow.nodes.filter(n => n.type.includes('webhook') || n.type.includes('cron') || n.type.includes('schedule')).length, icon: Play },
              { label: 'Actions', value: workflow.nodes.filter(n => !n.type.includes('webhook') && !n.type.includes('cron') && !n.type.includes('schedule')).length, icon: ArrowRight },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card p-4 text-center">
                  <Icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
