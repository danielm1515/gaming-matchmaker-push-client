import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-accent-primary to-purple-600 hover:from-purple-600 hover:to-accent-primary text-white shadow-glow hover:shadow-glow',
  secondary:
    'border border-bg-border text-text-primary hover:border-accent-primary hover:text-accent-primary bg-transparent',
  danger:
    'bg-accent-danger hover:bg-red-600 text-white',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-elevated bg-transparent',
  success:
    'bg-accent-success hover:bg-green-500 text-bg-primary font-semibold',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
