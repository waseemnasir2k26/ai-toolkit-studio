import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Play,
  Trash2,
  Copy,
  Download,
  ChevronUp,
  ChevronDown,
  FileInput,
  Wand2,
  FileOutput,
  Loader2,
  Check,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { cn, generateId, delay, copyToClipboard, downloadAsFile, getStorageItem, setStorageItem } from '../../lib/utils';

// Node type configurations
const nodeTypes = {
  input: {
    icon: FileInput,
    label: 'Input',
    color: 'amber',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    iconClass: 'text-amber-400',
    glowClass: 'shadow-amber-500/20',
  },
  prompt: {
    icon: Wand2,
    label: 'Prompt',
    color: 'violet',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/30',
    iconClass: 'text-violet-400',
    glowClass: 'shadow-violet-500/20',
  },
  output: {
    icon: FileOutput,
    label: 'Output',
    color: 'emerald',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    iconClass: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/20',
  },
};

// Quick prompt templates
const quickPrompts = [
  { label: 'Summarize', prompt: 'Summarize the following text in 2-3 sentences:\n\n{{input}}' },
  { label: 'Bullet Points', prompt: 'Convert this into bullet points:\n\n{{input}}' },
  { label: 'Translate Spanish', prompt: 'Translate to Spanish:\n\n{{input}}' },
  { label: 'Make Formal', prompt: 'Rewrite in a professional, formal tone:\n\n{{input}}' },
  { label: 'Expand', prompt: 'Expand and elaborate on this:\n\n{{input}}' },
  { label: 'Questions', prompt: 'Generate 5 questions based on:\n\n{{input}}' },
];

// Mock processor for simulating AI responses
function mockProcess(prompt, input) {
  const lowerPrompt = prompt.toLowerCase();
  const wordCount = input.split(/\s+/).filter(Boolean).length;
  const inputLength = input.length;

  if (lowerPrompt.includes('summarize') || lowerPrompt.includes('summary') || lowerPrompt.includes('tldr')) {
    const words = input.split(' ');
    const summaryLength = Math.min(30, Math.floor(words.length * 0.25));
    const summary = words.slice(0, summaryLength).join(' ');
    return `**Summary:**\n${summary}${words.length > summaryLength ? '...' : ''}\n\n[Summarized: ${wordCount} words -> ~${summaryLength} words]`;
  }

  if (lowerPrompt.includes('spanish') || lowerPrompt.includes('espanol')) {
    return `**Traduccion al Espanol:**\n"${input.substring(0, 200)}${inputLength > 200 ? '...' : ''}"\n\n[Translated to Spanish - Simulated]`;
  }

  if (lowerPrompt.includes('french') || lowerPrompt.includes('francais')) {
    return `**Traduction en Francais:**\n"${input.substring(0, 200)}${inputLength > 200 ? '...' : ''}"\n\n[Translated to French - Simulated]`;
  }

  if (lowerPrompt.includes('bullet') || lowerPrompt.includes('list') || lowerPrompt.includes('points')) {
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const bullets = sentences.slice(0, 5).map(s => `• ${s.trim()}`).join('\n');
    return `**Key Points:**\n${bullets}\n\n[Extracted ${Math.min(5, sentences.length)} bullet points]`;
  }

  if (lowerPrompt.includes('expand') || lowerPrompt.includes('elaborate') || lowerPrompt.includes('detail')) {
    return `**Expanded Content:**\n${input}\n\nFurthermore, this topic encompasses several important aspects that merit deeper exploration. The underlying principles demonstrate significant implications for understanding the broader context.\n\n[Expanded: ${wordCount} words -> ~${wordCount + 30} words]`;
  }

  if (lowerPrompt.includes('formal') || lowerPrompt.includes('professional')) {
    return `**Professional Version:**\nRespected colleagues,\n\n${input.charAt(0).toUpperCase() + input.slice(1)}\n\nWe trust this serves your requirements.\n\nBest regards.\n\n[Formalized - Simulated]`;
  }

  if (lowerPrompt.includes('question') || lowerPrompt.includes('quiz')) {
    return `**Generated Questions:**\n1. What is the main idea presented?\n2. How does this relate to the broader context?\n3. What evidence supports the key claims?\n4. What are the potential implications?\n5. How might this apply in practice?\n\n[5 questions generated - Simulated]`;
  }

  if (lowerPrompt.includes('casual') || lowerPrompt.includes('friendly')) {
    return `**Casual Version:**\nHey there!\n\nSo basically, ${input.toLowerCase().substring(0, 150)}${inputLength > 150 ? '...' : ''}\n\nPretty cool, right?\n\n[Made casual - Simulated]`;
  }

  return `**Processed Output:**\n${input.substring(0, 300)}${inputLength > 300 ? '...' : ''}\n\n[AI Processing Complete]\n• Input: ${wordCount} words (${inputLength} chars)\n• Status: Success`;
}

// Individual Node Component
function Node({ node, index, totalNodes, onUpdate, onDelete, onMove, isRunning }) {
  const config = nodeTypes[node.type];
  const Icon = config.icon;
  const StatusIcon = node.status === 'running' ? Loader2 :
                     node.status === 'complete' ? Check :
                     node.status === 'error' ? AlertCircle : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'relative rounded-2xl border-2 overflow-hidden transition-all duration-300',
        config.bgClass,
        config.borderClass,
        node.status === 'running' && 'border-blue-500/50 shadow-lg shadow-blue-500/20',
        node.status === 'complete' && 'border-emerald-500/50 shadow-lg shadow-emerald-500/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-xl',
            config.bgClass,
            'border',
            config.borderClass
          )}>
            {node.status === 'running' ? (
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            ) : node.status === 'complete' ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Icon className={cn('w-5 h-5', config.iconClass)} />
            )}
          </div>
          <div>
            <input
              type="text"
              value={node.title}
              onChange={(e) => onUpdate(node.id, { title: e.target.value })}
              className="bg-transparent font-semibold text-white border-none outline-none focus:ring-0 w-full"
              placeholder={config.label}
            />
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" size="sm">{config.label.toUpperCase()}</Badge>
              <span className="text-xs text-gray-500">Step {index + 1}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove(node.id, 'up')}
            disabled={index === 0 || isRunning}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove(node.id, 'down')}
            disabled={index === totalNodes - 1 || isRunning}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(node.id)}
            disabled={isRunning}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {node.type === 'input' && (
          <Textarea
            value={node.content}
            onChange={(e) => onUpdate(node.id, { content: e.target.value })}
            placeholder="Enter your input text here... This could be an article, document, or any content you want to process."
            rows={4}
            disabled={isRunning}
            className="bg-dark-800/50"
          />
        )}

        {node.type === 'prompt' && (
          <>
            <Textarea
              value={node.content}
              onChange={(e) => onUpdate(node.id, { content: e.target.value })}
              placeholder="Enter your prompt instructions here. Use {{input}} to reference the previous step's output."
              rows={4}
              disabled={isRunning}
              className="bg-dark-800/50 font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => onUpdate(node.id, { content: qp.prompt })}
                  disabled={isRunning}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-600/50 text-gray-400 hover:text-white hover:bg-dark-500/50 transition-colors disabled:opacity-50"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </>
        )}

        {node.type === 'output' && (
          <div className="min-h-[100px] p-4 rounded-xl bg-dark-800/50 border border-dark-600/30">
            {node.output ? (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{node.output}</pre>
            ) : (
              <p className="text-gray-500 text-sm italic">Output will appear here after running the chain...</p>
            )}
          </div>
        )}

        {/* Output preview for prompt nodes */}
        {node.type === 'prompt' && node.output && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-500 mb-2 font-medium">Output Preview:</p>
            <div className="p-3 rounded-lg bg-dark-800/50 border border-dark-600/30">
              <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono line-clamp-3">
                {node.output}
              </pre>
            </div>
          </div>
        )}

        {/* Character count for input */}
        {node.type === 'input' && (
          <div className="text-right text-xs text-gray-500">
            {node.content?.length || 0} characters
          </div>
        )}
      </div>

      {/* Output actions */}
      {node.type === 'output' && node.output && (
        <div className="px-4 pb-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Copy}
            onClick={() => {
              copyToClipboard(node.output);
            }}
          >
            Copy
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => {
              downloadAsFile(node.output, 'promptflow-output.txt');
            }}
          >
            Download
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// Connector Arrow
function Connector({ isAnimating }) {
  return (
    <div className="flex justify-center py-2">
      <motion.div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center',
          isAnimating ? 'bg-blue-500/20' : 'bg-dark-600/50'
        )}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <ArrowDown className={cn(
          'w-4 h-4',
          isAnimating ? 'text-blue-400' : 'text-gray-500'
        )} />
      </motion.div>
    </div>
  );
}

// Main PromptFlow Component
export default function PromptFlow() {
  const toast = useToast();
  const [nodes, setNodes] = useState(() => {
    const saved = getStorageItem('promptflow_chain');
    return saved || [
      { id: generateId(), type: 'input', title: 'Input', content: '', output: null, status: 'idle' },
      { id: generateId(), type: 'prompt', title: 'Process', content: 'Summarize the following:\n\n{{input}}', output: null, status: 'idle' },
      { id: generateId(), type: 'output', title: 'Final Output', content: '', output: null, status: 'idle' },
    ];
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  // Auto-save
  useEffect(() => {
    if (nodes.length > 0) {
      setStorageItem('promptflow_chain', nodes);
    }
  }, [nodes]);

  // Update node
  const updateNode = useCallback((id, updates) => {
    setNodes(prev => prev.map(node =>
      node.id === id ? { ...node, ...updates } : node
    ));
  }, []);

  // Delete node
  const deleteNode = useCallback((id) => {
    setNodes(prev => prev.filter(node => node.id !== id));
  }, []);

  // Move node
  const moveNode = useCallback((id, direction) => {
    setNodes(prev => {
      const index = prev.findIndex(n => n.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newNodes = [...prev];
      [newNodes[index], newNodes[newIndex]] = [newNodes[newIndex], newNodes[index]];
      return newNodes;
    });
  }, []);

  // Add node
  const addNode = useCallback((type) => {
    const newNode = {
      id: generateId(),
      type,
      title: type === 'input' ? 'Input' : type === 'prompt' ? 'Prompt Step' : 'Output',
      content: type === 'prompt' ? 'Process the following:\n\n{{input}}' : '',
      output: null,
      status: 'idle',
    };

    setNodes(prev => {
      if (type === 'input') return [newNode, ...prev];
      if (type === 'output') return [...prev, newNode];

      const lastOutputIndex = prev.findLastIndex(n => n.type === 'output');
      if (lastOutputIndex > 0) {
        const newNodes = [...prev];
        newNodes.splice(lastOutputIndex, 0, newNode);
        return newNodes;
      }
      return [...prev, newNode];
    });
  }, []);

  // Run chain
  const runChain = useCallback(async () => {
    setIsRunning(true);
    setCurrentStep(0);

    // Reset all nodes
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle', output: null })));

    let currentData = '';

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setCurrentStep(i);

      // Set running status
      setNodes(prev => prev.map((n, idx) =>
        idx === i ? { ...n, status: 'running' } : n
      ));

      // Simulate processing delay
      await delay(800 + Math.random() * 700);

      let output = '';

      switch (node.type) {
        case 'input':
          output = node.content || '[No input provided]';
          currentData = output;
          break;

        case 'prompt': {
          const processedPrompt = node.content.replace(/\{\{input\}\}/gi, currentData);
          output = mockProcess(processedPrompt, currentData);
          currentData = output;
          break;
        }

        case 'output':
          output = currentData;
          break;
      }

      // Set complete status
      setNodes(prev => prev.map((n, idx) =>
        idx === i ? { ...n, status: 'complete', output } : n
      ));
    }

    setIsRunning(false);
    setCurrentStep(-1);
    toast.success('Chain Complete', 'All steps processed successfully!');
  }, [nodes, toast]);

  // Reset chain
  const resetChain = useCallback(() => {
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle', output: null })));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setNodes([
      { id: generateId(), type: 'input', title: 'Input', content: '', output: null, status: 'idle' },
      { id: generateId(), type: 'prompt', title: 'Process', content: 'Process the following:\n\n{{input}}', output: null, status: 'idle' },
      { id: generateId(), type: 'output', title: 'Final Output', content: '', output: null, status: 'idle' },
    ]);
    toast.info('Chain Cleared', 'Started with a fresh chain.');
  }, [toast]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-brand-400" />
              Prompt Flow
            </h1>
            <p className="text-gray-400 mt-1">
              Build visual prompt chains where outputs become inputs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={resetChain}
              disabled={isRunning}
            >
              Reset
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={clearAll}
              disabled={isRunning}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Add Node Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant="secondary"
            size="sm"
            icon={FileInput}
            onClick={() => addNode('input')}
            disabled={isRunning}
          >
            Add Input
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Wand2}
            onClick={() => addNode('prompt')}
            disabled={isRunning}
          >
            Add Prompt
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={FileOutput}
            onClick={() => addNode('output')}
            disabled={isRunning}
          >
            Add Output
          </Button>
        </div>

        {/* Nodes */}
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => (
              <div key={node.id}>
                <Node
                  node={node}
                  index={index}
                  totalNodes={nodes.length}
                  onUpdate={updateNode}
                  onDelete={deleteNode}
                  onMove={moveNode}
                  isRunning={isRunning}
                />
                {index < nodes.length - 1 && (
                  <Connector isAnimating={isRunning && currentStep === index} />
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Run Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="glow"
            size="lg"
            icon={isRunning ? Loader2 : Play}
            onClick={runChain}
            disabled={isRunning}
            className="min-w-[200px]"
          >
            {isRunning ? 'Running...' : 'Run Chain'}
          </Button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-xl bg-dark-800/30 border border-dark-600/30">
          <p className="text-sm text-gray-400 text-center">
            <span className="text-amber-400">Note:</span> This is a mock simulation for learning prompt chaining concepts.
            No actual AI APIs are called.
          </p>
        </div>
      </div>
    </div>
  );
}
