import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  secondary: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/15 text-red-400 border-red-500/20',
  info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  pink: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const config = {
    active: { variant: 'success', label: 'Active' },
    pending: { variant: 'warning', label: 'Pending' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    error: { variant: 'danger', label: 'Error' },
  };

  const { variant, label } = config[status] || config.inactive;

  return (
    <Badge variant={variant}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}

export function CountBadge({ count, max = 99, className }) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5',
        'bg-brand-500 text-white text-xs font-bold rounded-full',
        className
      )}
    >
      {displayCount}
    </span>
  );
}
