import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function GlowingCard({
  children,
  className,
  glowColor = 'brand',
  hoverScale = 1.02,
  onClick,
  ...props
}) {
  const glowColors = {
    brand: 'from-brand-500/20 to-accent-purple/20',
    cyan: 'from-accent-cyan/20 to-brand-500/20',
    purple: 'from-accent-purple/20 to-accent-pink/20',
    green: 'from-accent-green/20 to-accent-cyan/20',
  };

  return (
    <motion.div
      className={cn(
        'relative group cursor-pointer rounded-2xl',
        className
      )}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      {...props}
    >
      {/* Animated glow border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-500/50 via-accent-purple/50 to-accent-cyan/50 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />

      {/* Card content */}
      <div className={cn(
        'relative bg-dark-800/90 backdrop-blur-xl rounded-2xl border border-dark-600/50',
        'group-hover:border-brand-500/30 transition-all duration-300',
        'overflow-hidden'
      )}>
        {/* Inner glow */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          glowColors[glowColor]
        )} />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function GlowingBorder({ children, className }) {
  return (
    <div className={cn('relative p-[1px] rounded-2xl overflow-hidden', className)}>
      {/* Animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-accent-purple to-accent-cyan animate-gradient bg-[length:200%_200%]" />

      {/* Inner content */}
      <div className="relative bg-dark-800 rounded-2xl">
        {children}
      </div>
    </div>
  );
}

export function SpotlightCard({ children, className, spotlightColor = 'brand' }) {
  const colors = {
    brand: 'rgba(99, 102, 241, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)',
    cyan: 'rgba(34, 211, 238, 0.15)',
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-dark-800/50 border border-dark-600/50',
        'hover:border-brand-500/30 transition-colors duration-300',
        className
      )}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${colors[spotlightColor]}, transparent 40%)`,
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
