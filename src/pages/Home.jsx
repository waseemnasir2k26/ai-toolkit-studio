import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  FileCode,
  Video,
  Share2,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { Button, ShimmerButton } from '../components/ui/Button';
import { GlowingCard } from '../components/ui/GlowingCard';
import { Badge } from '../components/ui/Badge';

const tools = [
  {
    name: 'Prompt Flow',
    description: 'Visual prompt chain builder. Design multi-step AI workflows where outputs become inputs.',
    icon: Wand2,
    color: 'from-violet-500 to-purple-600',
    path: '/tools/prompt-flow',
    badge: 'Popular',
  },
  {
    name: 'n8n Visualizer',
    description: 'Transform n8n workflow JSON into beautiful interactive flowcharts instantly.',
    icon: FileCode,
    color: 'from-emerald-500 to-teal-600',
    path: '/tools/n8n-visualizer',
    badge: 'New',
  },
  {
    name: 'Video Script AI',
    description: 'Generate complete video scripts with scene breakdowns and VEO3/SORA prompts.',
    icon: Video,
    color: 'from-pink-500 to-rose-600',
    path: '/tools/video-script',
    badge: null,
  },
  {
    name: 'Social Converter',
    description: 'Convert one post into optimized versions for LinkedIn, Twitter, Instagram & more.',
    icon: Share2,
    color: 'from-cyan-500 to-blue-600',
    path: '/tools/social-converter',
    badge: null,
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'All tools run client-side. No waiting for servers, no API limits.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays in your browser. Nothing is sent to external servers.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Responsive design that works perfectly on desktop, tablet, and mobile.',
  },
  {
    icon: Cpu,
    title: 'No API Keys',
    description: 'Use all tools without any external API keys or subscriptions.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-pattern opacity-50" />

        {/* Spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary" className="mb-6">
              <Sparkles className="w-3 h-3" />
              Powered by AI
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Build Smarter with
            <span className="block gradient-text mt-2">AI-Powered Tools</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A collection of powerful, free AI tools for creators, developers, and content professionals.
            No API keys required. Everything runs in your browser.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/tools/prompt-flow">
              <ShimmerButton>
                <Wand2 className="w-5 h-5" />
                Try Prompt Flow
                <ArrowRight className="w-4 h-4" />
              </ShimmerButton>
            </Link>
            <Link to="/admin">
              <Button variant="secondary" size="lg">
                Admin Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Powerful AI Tools</h2>
            <p className="section-subtitle mt-4">
              Everything you need to supercharge your workflow
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.name} variants={itemVariants}>
                  <Link to={tool.path}>
                    <GlowingCard className="h-full">
                      <div className="p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {tool.badge && (
                            <Badge variant={tool.badge === 'New' ? 'success' : 'primary'} size="sm">
                              {tool.badge}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
                        <p className="text-gray-400 leading-relaxed">{tool.description}</p>

                        <div className="flex items-center gap-2 mt-6 text-brand-400 font-medium text-sm group-hover:gap-3 transition-all">
                          Try it now
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </GlowingCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-dark-600/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why AI ToolKit?</h2>
            <p className="section-subtitle mt-4">
              Built for speed, privacy, and ease of use
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="card p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-accent-purple/10 to-accent-cyan/20" />
            <div className="absolute inset-0 bg-dark-800/50 backdrop-blur-xl" />
            <div className="absolute inset-[1px] rounded-3xl bg-dark-800/80" />

            {/* Content */}
            <div className="relative">
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-brand-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to supercharge your workflow?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Start using our AI-powered tools today. No signup required, no credit card needed.
              </p>
              <Link to="/tools/prompt-flow">
                <Button variant="primary" size="lg">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
