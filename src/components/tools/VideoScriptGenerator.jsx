import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Sparkles,
  Play,
  Clock,
  Film,
  Camera,
  Mic,
  Music,
  Type,
  Copy,
  Check,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Wand2,
  Image,
  Clapperboard,
  Volume2,
} from 'lucide-react';
import { Button, IconButton } from '../ui/Button';
import { GlowingCard } from '../ui/GlowingCard';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

// Video style presets
const videoStyles = [
  { id: 'cinematic', label: 'Cinematic', description: 'Epic, movie-like visuals' },
  { id: 'documentary', label: 'Documentary', description: 'Real, authentic footage' },
  { id: 'animated', label: 'Animated', description: '2D/3D animation style' },
  { id: 'minimal', label: 'Minimal', description: 'Clean, simple aesthetics' },
  { id: 'dramatic', label: 'Dramatic', description: 'High contrast, intense' },
  { id: 'vibrant', label: 'Vibrant', description: 'Colorful, energetic' },
];

// Duration presets
const durations = [
  { value: 30, label: '30 sec', scenes: 3 },
  { value: 60, label: '1 min', scenes: 5 },
  { value: 120, label: '2 min', scenes: 8 },
  { value: 300, label: '5 min', scenes: 12 },
];

// Mock AI generation function
const generateVideoScript = async (topic, style, duration, platform) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const sceneCount = durations.find(d => d.value === duration)?.scenes || 5;
  const sceneDuration = Math.floor(duration / sceneCount);

  const hooks = [
    `What if I told you ${topic} could change everything?`,
    `Most people get ${topic} completely wrong. Here's the truth.`,
    `In the next ${Math.floor(duration / 60)} minute${duration >= 120 ? 's' : ''}, you'll discover the secret to ${topic}.`,
    `Stop scrolling. This is the ${topic} content you've been looking for.`,
  ];

  const scenes = [];
  const sceneTypes = ['hook', 'problem', 'solution', 'proof', 'cta'];

  for (let i = 0; i < sceneCount; i++) {
    const sceneType = sceneTypes[Math.min(i, sceneTypes.length - 1)];
    scenes.push(generateScene(i + 1, sceneType, topic, style, sceneDuration));
  }

  return {
    title: `${topic} - ${style.charAt(0).toUpperCase() + style.slice(1)} Video`,
    hook: hooks[Math.floor(Math.random() * hooks.length)],
    totalDuration: duration,
    style,
    platform,
    scenes,
    music: generateMusicSuggestion(style),
    voiceover: {
      tone: style === 'dramatic' ? 'Deep, authoritative' : 'Friendly, conversational',
      pace: duration < 60 ? 'Fast-paced' : 'Moderate',
      emotion: style === 'cinematic' ? 'Epic, inspiring' : 'Engaging, relatable',
    },
  };
};

const generateScene = (number, type, topic, style, duration) => {
  const sceneContent = {
    hook: {
      narration: `Open with a powerful visual that immediately captures attention. The viewer should be hooked within the first 3 seconds.`,
      visual: `Wide establishing shot, dramatic lighting, subject centered`,
      action: `Quick cuts, zoom effects, attention-grabbing motion`,
    },
    problem: {
      narration: `Present the problem or challenge related to ${topic}. Create emotional connection with the audience.`,
      visual: `Medium shots showing relatable scenarios, subtle color grading`,
      action: `Smooth transitions, empathetic framing`,
    },
    solution: {
      narration: `Introduce the solution or key insight about ${topic}. This is the core value of the video.`,
      visual: `Bright, optimistic visuals, clear demonstrations`,
      action: `Explanatory animations, step-by-step reveals`,
    },
    proof: {
      narration: `Provide evidence, examples, or testimonials that support the main message about ${topic}.`,
      visual: `Data visualizations, real examples, social proof`,
      action: `Confident pacing, build credibility`,
    },
    cta: {
      narration: `Clear call-to-action. Tell viewers exactly what to do next.`,
      visual: `Logo, subscribe button, contact info prominently displayed`,
      action: `End card, lingering shot, memorable closing`,
    },
  };

  const content = sceneContent[type] || sceneContent.solution;

  return {
    number,
    type,
    duration,
    narration: content.narration,
    visual: content.visual,
    action: content.action,
    veoPrompt: generateVeoPrompt(type, topic, style),
    soraPrompt: generateSoraPrompt(type, topic, style),
    cameraMovement: ['Static', 'Pan left', 'Pan right', 'Dolly in', 'Crane up', 'Tracking shot'][Math.floor(Math.random() * 6)],
    transition: ['Cut', 'Dissolve', 'Fade', 'Wipe', 'Zoom'][Math.floor(Math.random() * 5)],
  };
};

const generateVeoPrompt = (type, topic, style) => {
  const styleModifiers = {
    cinematic: 'cinematic lighting, shallow depth of field, 4K, film grain, anamorphic lens flare',
    documentary: 'natural lighting, handheld camera, authentic, raw footage, real world',
    animated: '3D animation, stylized, vibrant colors, smooth motion, Pixar quality',
    minimal: 'clean background, simple composition, negative space, modern aesthetic',
    dramatic: 'high contrast, moody lighting, shadows, intense atmosphere, noir style',
    vibrant: 'saturated colors, energetic, dynamic lighting, bold visuals, eye-catching',
  };

  return `A ${style} scene about ${topic}. ${styleModifiers[style]}. Scene type: ${type}. Professional quality, smooth motion, compelling visual narrative.`;
};

const generateSoraPrompt = (type, topic, style) => {
  return `Create a ${style} video scene: ${topic}. The scene should convey ${type === 'hook' ? 'immediate attention and intrigue' : type === 'cta' ? 'clear action and urgency' : 'engagement and understanding'}. High production value, seamless motion, photorealistic or stylized based on ${style} aesthetic. Camera movement should enhance storytelling.`;
};

const generateMusicSuggestion = (style) => {
  const musicStyles = {
    cinematic: { genre: 'Orchestral / Epic', mood: 'Inspiring, building', tempo: '90-120 BPM' },
    documentary: { genre: 'Ambient / Acoustic', mood: 'Thoughtful, authentic', tempo: '70-90 BPM' },
    animated: { genre: 'Upbeat / Electronic', mood: 'Fun, energetic', tempo: '120-140 BPM' },
    minimal: { genre: 'Lo-fi / Piano', mood: 'Calm, focused', tempo: '60-80 BPM' },
    dramatic: { genre: 'Cinematic / Tension', mood: 'Intense, suspenseful', tempo: '80-100 BPM' },
    vibrant: { genre: 'Pop / Electronic', mood: 'Happy, exciting', tempo: '110-130 BPM' },
  };

  return musicStyles[style] || musicStyles.cinematic;
};

function SceneCard({ scene, isExpanded, onToggle }) {
  const [copiedVeo, setCopiedVeo] = useState(false);
  const [copiedSora, setCopiedSora] = useState(false);

  const copyPrompt = async (text, type) => {
    await navigator.clipboard.writeText(text);
    if (type === 'veo') {
      setCopiedVeo(true);
      setTimeout(() => setCopiedVeo(false), 2000);
    } else {
      setCopiedSora(true);
      setTimeout(() => setCopiedSora(false), 2000);
    }
  };

  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Scene Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-700/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center">
            <span className="text-white font-bold">{scene.number}</span>
          </div>
          <div>
            <h3 className="font-semibold text-white capitalize">{scene.type} Scene</h3>
            <p className="text-sm text-gray-400">{scene.duration}s duration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">{scene.cameraMovement}</Badge>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Scene Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-dark-600/50"
          >
            <div className="p-4 space-y-4">
              {/* Narration */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-brand-400" />
                  <span className="text-sm font-medium text-gray-300">Narration</span>
                </div>
                <p className="text-gray-400 text-sm bg-dark-900/50 p-3 rounded-lg">{scene.narration}</p>
              </div>

              {/* Visual Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-300">Visual</span>
                </div>
                <p className="text-gray-400 text-sm bg-dark-900/50 p-3 rounded-lg">{scene.visual}</p>
              </div>

              {/* Action */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clapperboard className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-gray-300">Action & Movement</span>
                </div>
                <p className="text-gray-400 text-sm bg-dark-900/50 p-3 rounded-lg">{scene.action}</p>
              </div>

              {/* AI Prompts */}
              <div className="grid md:grid-cols-2 gap-3">
                {/* VEO Prompt */}
                <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 p-4 rounded-xl border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-300">VEO3 Prompt</span>
                    </div>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); copyPrompt(scene.veoPrompt, 'veo'); }}
                    >
                      {copiedVeo ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </IconButton>
                  </div>
                  <p className="text-xs text-gray-400">{scene.veoPrompt}</p>
                </div>

                {/* SORA Prompt */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 rounded-xl border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold text-cyan-300">SORA Prompt</span>
                    </div>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); copyPrompt(scene.soraPrompt, 'sora'); }}
                    >
                      {copiedSora ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </IconButton>
                  </div>
                  <p className="text-xs text-gray-400">{scene.soraPrompt}</p>
                </div>
              </div>

              {/* Technical Details */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" size="sm">
                  <Camera className="w-3 h-3" />
                  {scene.cameraMovement}
                </Badge>
                <Badge variant="secondary" size="sm">
                  <Film className="w-3 h-3" />
                  {scene.transition}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VideoScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [duration, setDuration] = useState(60);
  const [platform, setPlatform] = useState('youtube');
  const [script, setScript] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedScenes, setExpandedScenes] = useState(new Set([1]));
  const toast = useToast();

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error('Error', 'Please enter a video topic');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateVideoScript(topic, style, duration, platform);
      setScript(result);
      setExpandedScenes(new Set([1]));
      toast.success('Success', 'Video script generated!');
    } catch (error) {
      toast.error('Error', 'Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  }, [topic, style, duration, platform, toast]);

  const toggleScene = (number) => {
    const newExpanded = new Set(expandedScenes);
    if (newExpanded.has(number)) {
      newExpanded.delete(number);
    } else {
      newExpanded.add(number);
    }
    setExpandedScenes(newExpanded);
  };

  const exportScript = () => {
    if (!script) return;

    const text = `
# ${script.title}

## Overview
- Duration: ${Math.floor(script.totalDuration / 60)}:${(script.totalDuration % 60).toString().padStart(2, '0')}
- Style: ${script.style}
- Platform: ${script.platform}

## Hook
${script.hook}

## Scenes

${script.scenes.map(scene => `
### Scene ${scene.number}: ${scene.type.toUpperCase()}
Duration: ${scene.duration}s | Camera: ${scene.cameraMovement} | Transition: ${scene.transition}

**Narration:**
${scene.narration}

**Visual:**
${scene.visual}

**VEO3 Prompt:**
${scene.veoPrompt}

**SORA Prompt:**
${scene.soraPrompt}
`).join('\n---\n')}

## Music
- Genre: ${script.music.genre}
- Mood: ${script.music.mood}
- Tempo: ${script.music.tempo}

## Voiceover
- Tone: ${script.voiceover.tone}
- Pace: ${script.voiceover.pace}
- Emotion: ${script.voiceover.emotion}
    `.trim();

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported', 'Script exported!');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="primary" className="mb-4">
            <Video className="w-3 h-3" />
            AI Video Tool
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            AI Video Script Generator
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Generate complete video scripts with scene breakdowns, narration, and
            ready-to-use VEO3 and SORA prompts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlowingCard className="sticky top-24">
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-white">Video Settings</h2>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Topic
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., How to start a successful online business in 2024"
                    className="w-full h-24 p-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500/50 resize-none"
                  />
                </div>

                {/* Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Visual Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {videoStyles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          style === s.id
                            ? 'border-brand-500 bg-brand-500/10'
                            : 'border-dark-600/50 hover:border-dark-400'
                        }`}
                      >
                        <p className="text-sm font-medium text-white">{s.label}</p>
                        <p className="text-xs text-gray-500">{s.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration
                  </label>
                  <div className="flex gap-2">
                    {durations.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDuration(d.value)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          duration === d.value
                            ? 'bg-brand-500 text-white'
                            : 'bg-dark-700/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-3 bg-dark-800/50 border border-dark-600/50 rounded-xl text-gray-100 focus:outline-none focus:border-brand-500/50"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram Reels</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                {/* Generate Button */}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Script
                    </>
                  )}
                </Button>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {!script ? (
              <div className="card p-12 text-center">
                <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Script Yet</h3>
                <p className="text-gray-500">Enter your topic and click Generate to create your video script</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Script Header */}
                <GlowingCard>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white">{script.title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="primary">
                            <Clock className="w-3 h-3" />
                            {Math.floor(script.totalDuration / 60)}:{(script.totalDuration % 60).toString().padStart(2, '0')}
                          </Badge>
                          <Badge variant="secondary">{script.scenes.length} scenes</Badge>
                          <Badge variant="secondary" className="capitalize">{script.style}</Badge>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={exportScript}>
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>

                    {/* Hook */}
                    <div className="bg-gradient-to-r from-brand-500/10 to-accent-purple/10 p-4 rounded-xl border border-brand-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Play className="w-4 h-4 text-brand-400" />
                        <span className="text-sm font-semibold text-brand-300">Opening Hook</span>
                      </div>
                      <p className="text-white">{script.hook}</p>
                    </div>

                    {/* Music & Voiceover */}
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-dark-800/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Music className="w-4 h-4 text-pink-400" />
                          <span className="text-sm font-semibold text-gray-300">Music</span>
                        </div>
                        <p className="text-sm text-gray-400">{script.music.genre}</p>
                        <p className="text-xs text-gray-500">{script.music.mood} | {script.music.tempo}</p>
                      </div>
                      <div className="bg-dark-800/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-semibold text-gray-300">Voiceover</span>
                        </div>
                        <p className="text-sm text-gray-400">{script.voiceover.tone}</p>
                        <p className="text-xs text-gray-500">{script.voiceover.pace} | {script.voiceover.emotion}</p>
                      </div>
                    </div>
                  </div>
                </GlowingCard>

                {/* Scenes */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white px-1">Scene Breakdown</h3>
                  {script.scenes.map((scene) => (
                    <SceneCard
                      key={scene.number}
                      scene={scene}
                      isExpanded={expandedScenes.has(scene.number)}
                      onToggle={() => toggleScene(scene.number)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
