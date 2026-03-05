import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`
            w-full px-3 py-2 rounded-lg text-sm
            bg-bg-elevated border text-text-primary
            placeholder:text-text-muted
            focus:outline-none focus:ring-1 focus:ring-accent-primary
            transition-colors duration-200
            ${error ? 'border-accent-danger' : 'border-bg-border focus:border-accent-primary'}
            ${className}
          `}
        />
        {error && <span className="text-xs text-accent-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
