import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500',
  secondary: 'bg-dark-600 text-gray-200 border border-dark-500 hover:bg-dark-500 hover:border-dark-400',
  ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
  success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
  outline: 'bg-transparent border-2 border-brand-500/50 text-brand-400 hover:bg-brand-500/10 hover:border-brand-500',
  glow: 'bg-gradient-to-r from-brand-500 to-accent-purple text-white shadow-glow hover:shadow-glow-lg',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-xl gap-2.5',
  icon: 'p-2.5 rounded-xl',
  'icon-sm': 'p-2 rounded-lg',
  'icon-lg': 'p-3.5 rounded-xl',
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className,
  asChild = false,
  animated = true,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </>
  );

  const buttonClasses = cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-dark-900',
    variants[variant],
    sizes[size],
    className
  );

  if (animated) {
    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        {...props}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

// Shimmer Button - Premium animated button
export function ShimmerButton({ children, className, ...props }) {
  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center px-6 py-3 overflow-hidden',
        'font-semibold text-white rounded-xl',
        'bg-gradient-to-r from-brand-500 to-brand-600',
        'shadow-lg shadow-brand-500/25',
        'transition-shadow duration-300 hover:shadow-brand-500/40',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 flex">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
      </div>

      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

// Icon Button
export function IconButton({ icon: Icon, children, className, variant = 'ghost', size = 'icon', ...props }) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('aspect-square', className)}
      {...props}
    >
      {Icon ? <Icon className="w-5 h-5" /> : children}
    </Button>
  );
}
