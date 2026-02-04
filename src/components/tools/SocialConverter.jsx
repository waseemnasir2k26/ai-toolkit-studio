import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Type,
  Hash,
  AtSign,
  Smile,
  TrendingUp,
  MessageCircle,
  Heart,
  Repeat2,
  BarChart2,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import { Button, IconButton } from '../ui/Button';
import { GlowingCard } from '../ui/GlowingCard';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

// Platform configurations
const platforms = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    color: 'from-blue-400 to-blue-600',
    charLimit: 280,
    features: ['Threads', 'Hashtags', 'Mentions'],
    bestPractices: 'Short, punchy, engaging. Use threads for longer content.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'from-blue-600 to-blue-800',
    charLimit: 3000,
    features: ['Professional tone', 'Insights', 'Stories'],
    bestPractices: 'Professional, value-driven, storytelling hooks.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 to-purple-600',
    charLimit: 2200,
    features: ['Emojis', 'Hashtags', 'CTA'],
    bestPractices: 'Visual-first, lifestyle-focused, heavy emoji use.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-500 to-blue-700',
    charLimit: 63206,
    features: ['Community', 'Questions', 'Stories'],
    bestPractices: 'Conversational, community-building, questions.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    color: 'from-gray-900 to-gray-700',
    charLimit: 2200,
    features: ['Trends', 'Hooks', 'Viral potential'],
    bestPractices: 'Trendy, hook-first, Gen-Z friendly language.',
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: AtSign,
    color: 'from-gray-700 to-gray-900',
    charLimit: 500,
    features: ['Conversations', 'Hot takes', 'Threads'],
    bestPractices: 'Casual, conversational, opinion-driven.',
  },
];

// Tone presets
const tones = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'casual', label: 'Casual', emoji: '😊' },
  { id: 'humorous', label: 'Humorous', emoji: '😂' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { id: 'urgent', label: 'Urgent', emoji: '🔥' },
  { id: 'educational', label: 'Educational', emoji: '📚' },
];

// Mock AI conversion function
const convertPost = async (content, tone, targetPlatforms) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const conversions = {};

  targetPlatforms.forEach(platformId => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    conversions[platformId] = generatePlatformPost(content, tone, platform);
  });

  return conversions;
};

const generatePlatformPost = (originalContent, tone, platform) => {
  const words = originalContent.split(' ');
  const mainIdea = originalContent.slice(0, 100);

  // Platform-specific transformations
  const transformations = {
    twitter: () => {
      const hook = generateHook(tone, 'twitter');
      const hashtags = generateHashtags(originalContent, 3);
      let post = `${hook}\n\n${truncateText(originalContent, 200)}`;
      if (post.length + hashtags.length + 2 <= 280) {
        post += `\n\n${hashtags}`;
      }
      return {
        content: truncateText(post, 280),
        thread: originalContent.length > 200 ? generateThread(originalContent, tone) : null,
        suggestions: ['Add an image for 150% more engagement', 'Post between 8-10 AM or 6-9 PM', 'Reply to early comments quickly'],
      };
    },

    linkedin: () => {
      const hook = generateHook(tone, 'linkedin');
      const storytelling = tone === 'professional'
        ? `Here's what I learned:\n\n${originalContent}`
        : originalContent;
      return {
        content: `${hook}\n\n${storytelling}\n\n💡 What are your thoughts on this?\n\n#Leadership #Growth #Success`,
        suggestions: ['Add a personal story for 2x engagement', 'Use line breaks every 2-3 sentences', 'End with a question to boost comments'],
      };
    },

    instagram: () => {
      const emojis = ['✨', '🔥', '💪', '🚀', '💯', '🙌', '❤️', '⭐'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const hashtags = generateHashtags(originalContent, 20);
      return {
        content: `${randomEmoji} ${originalContent}\n\n.\n.\n.\n${hashtags}`,
        suggestions: ['Use a carousel for 3x more saves', 'First line is crucial - make it count', 'Add 3-5 hashtags in first comment'],
      };
    },

    facebook: () => {
      return {
        content: `${generateHook(tone, 'facebook')}\n\n${originalContent}\n\n👇 Drop a comment if you agree!`,
        suggestions: ['Ask a question to boost engagement', 'Tag relevant friends or pages', 'Best posting time: 1-4 PM'],
      };
    },

    tiktok: () => {
      const hook = generateViralHook(tone);
      return {
        content: `${hook}\n\n${truncateText(originalContent, 150)}\n\n#fyp #viral #trending`,
        suggestions: ['First 3 seconds determine if people stay', 'Use trending sounds', 'Post 1-3 times daily for growth'],
      };
    },

    threads: () => {
      return {
        content: `Hot take: ${truncateText(originalContent, 400)}\n\nAgree or disagree? 👇`,
        suggestions: ['Be conversational and authentic', 'Reply to other threads', 'Share opinions, not just facts'],
      };
    },
  };

  const generator = transformations[platform.id] || transformations.twitter;
  const result = generator();

  return {
    ...result,
    platform,
    charCount: result.content.length,
    isWithinLimit: result.content.length <= platform.charLimit,
    engagementScore: Math.floor(Math.random() * 30) + 70,
  };
};

const generateHook = (tone, platform) => {
  const hooks = {
    professional: {
      twitter: '🚨 Important insight:',
      linkedin: 'I used to think this was impossible. Then everything changed.',
      facebook: 'You need to hear this 👇',
    },
    casual: {
      twitter: 'okay but hear me out...',
      linkedin: 'Quick story time! 📖',
      facebook: 'So this happened today...',
    },
    humorous: {
      twitter: 'Nobody:\nAbsolutely nobody:\nMe:',
      linkedin: 'Plot twist: the real lesson was unexpected 😅',
      facebook: 'Tell me you\'re a [professional] without telling me 😂',
    },
    inspirational: {
      twitter: '✨ A reminder you might need today:',
      linkedin: 'The moment everything clicked for me:',
      facebook: 'If no one has told you today... 💙',
    },
    urgent: {
      twitter: '🔴 BREAKING:',
      linkedin: '⚠️ This is changing everything:',
      facebook: 'STOP SCROLLING - You need to see this',
    },
    educational: {
      twitter: '🧵 A thread on something important:',
      linkedin: "Here's what most people get wrong:",
      facebook: 'Quick lesson that took me years to learn:',
    },
  };

  return hooks[tone]?.[platform] || hooks.casual.twitter;
};

const generateViralHook = (tone) => {
  const hooks = [
    'POV: you just discovered this',
    'Wait for it... 👀',
    'The algorithm blessed you today',
    'Things that just make sense:',
    'Tell me why this is so accurate',
    'No one talks about this enough:',
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
};

const generateHashtags = (content, count) => {
  const commonHashtags = ['success', 'motivation', 'growth', 'mindset', 'business', 'entrepreneur', 'life', 'goals', 'inspiration', 'tips', 'advice', 'learning', 'productivity', 'hustle', 'work', 'career', 'leadership', 'innovation', 'technology', 'future'];
  const selected = commonHashtags.sort(() => Math.random() - 0.5).slice(0, count);
  return selected.map(h => `#${h}`).join(' ');
};

const generateThread = (content, tone) => {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  const tweets = [];
  let current = '1/ ';

  sentences.forEach((sentence, i) => {
    if ((current + sentence).length > 270) {
      tweets.push(current.trim());
      current = `${tweets.length + 1}/ ${sentence}`;
    } else {
      current += sentence;
    }
  });

  if (current.length > 3) {
    tweets.push(current.trim());
  }

  return tweets;
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

function PlatformCard({ conversion, onCopy, copied }) {
  const Icon = conversion.platform.icon;

  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
      <div className={`p-4 bg-gradient-to-r ${conversion.platform.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{conversion.platform.name}</h3>
              <p className="text-xs text-white/70">
                {conversion.charCount} / {conversion.platform.charLimit} chars
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={conversion.isWithinLimit ? 'success' : 'danger'}
              size="sm"
              className="bg-white/20 border-white/30"
            >
              {conversion.isWithinLimit ? 'Valid' : 'Too Long'}
            </Badge>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => onCopy(conversion.platform.id, conversion.content)}
              className="text-white hover:bg-white/20"
            >
              {copied === conversion.platform.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-dark-900/50 p-4 rounded-xl mb-4">
          <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans">
            {conversion.content}
          </pre>
        </div>

        {/* Thread Preview */}
        {conversion.thread && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Thread ({conversion.thread.length} tweets)</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {conversion.thread.slice(0, 3).map((tweet, i) => (
                <div key={i} className="text-xs text-gray-400 bg-dark-800/50 p-2 rounded-lg">
                  {tweet}
                </div>
              ))}
              {conversion.thread.length > 3 && (
                <p className="text-xs text-gray-500">+{conversion.thread.length - 3} more tweets...</p>
              )}
            </div>
          </div>
        )}

        {/* Engagement Score */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-400">
              Est. engagement: <span className="text-emerald-400 font-medium">{conversion.engagementScore}%</span>
            </span>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">💡 Tips</p>
          <ul className="space-y-1">
            {conversion.suggestions.map((tip, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-brand-400">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function SocialConverter() {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter', 'linkedin', 'instagram']);
  const [conversions, setConversions] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(null);
  const { addToast } = useToast();

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleConvert = useCallback(async () => {
    if (!content.trim()) {
      addToast('Please enter your post content', 'error');
      return;
    }

    if (selectedPlatforms.length === 0) {
      addToast('Please select at least one platform', 'error');
      return;
    }

    setIsConverting(true);
    try {
      const result = await convertPost(content, tone, selectedPlatforms);
      setConversions(result);
      addToast('Posts converted successfully!', 'success');
    } catch (error) {
      addToast('Conversion failed', 'error');
    } finally {
      setIsConverting(false);
    }
  }, [content, tone, selectedPlatforms, addToast]);

  const handleCopy = async (platformId, text) => {
    await navigator.clipboard.writeText(text);
    setCopied(platformId);
    setTimeout(() => setCopied(null), 2000);
    addToast('Copied to clipboard!', 'success');
  };

  const copyAll = async () => {
    if (!conversions) return;
    const allContent = Object.values(conversions)
      .map(c => `--- ${c.platform.name} ---\n${c.content}`)
      .join('\n\n');
    await navigator.clipboard.writeText(allContent);
    addToast('All posts copied!', 'success');
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
            <Share2 className="w-3 h-3" />
            Social Media Tool
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Social Post Converter
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Convert one post into optimized versions for all social platforms.
            Each version is tailored for maximum engagement.
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
                <h2 className="text-lg font-semibold text-white">Your Content</h2>

                {/* Content Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Original Post
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here. Don't worry about formatting - we'll optimize it for each platform..."
                    className="w-full h-40 p-4 bg-dark-800/50 border border-dark-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500/50 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tone
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {tones.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          tone === t.id
                            ? 'bg-brand-500 text-white'
                            : 'bg-dark-700/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platforms
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      return (
                        <button
                          key={platform.id}
                          onClick={() => togglePlatform(platform.id)}
                          className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'border-brand-500 bg-brand-500/10'
                              : 'border-dark-600/50 hover:border-dark-400'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-200">{platform.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Convert Button */}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleConvert}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Convert Post
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
            {!conversions ? (
              <div className="card p-12 text-center">
                <Share2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Conversions Yet</h3>
                <p className="text-gray-500">Enter your content and click Convert to generate platform-specific posts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {Object.keys(conversions).length} Platform Versions
                  </h3>
                  <Button variant="secondary" size="sm" onClick={copyAll}>
                    <Copy className="w-4 h-4" />
                    Copy All
                  </Button>
                </div>

                {/* Platform Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.values(conversions).map((conversion) => (
                    <PlatformCard
                      key={conversion.platform.id}
                      conversion={conversion}
                      onCopy={handleCopy}
                      copied={copied}
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
