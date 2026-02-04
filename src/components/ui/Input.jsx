import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(({
  className,
  type = 'text',
  icon: Icon,
  error,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl',
          'text-gray-100 placeholder-gray-500',
          'transition-all duration-200',
          'focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-dark-700/50',
          Icon && 'pl-11',
          error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  className,
  rows = 4,
  error,
  ...props
}, ref) => {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-3 bg-dark-800/50 border border-dark-600/50 rounded-xl',
        'text-gray-100 placeholder-gray-500 resize-none',
        'transition-all duration-200',
        'focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-dark-700/50',
        'font-mono text-sm leading-relaxed',
        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
        className
      )}
      rows={rows}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export function Label({ children, className, required, ...props }) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-gray-300 mb-2',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

export function FormGroup({ children, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return (
    <p className="text-sm text-red-400 mt-1.5">{children}</p>
  );
}
