interface BadgeProps {
  children: React.ReactNode;
  color?: 'purple' | 'cyan' | 'green' | 'yellow' | 'red' | 'grey' | 'orange';
  size?: 'sm' | 'md';
}

const colorClasses = {
  purple: 'bg-accent-primary/20 text-accent-primary border-accent-primary/30',
  cyan: 'bg-accent-secondary/20 text-accent-secondary border-accent-secondary/30',
  green: 'bg-accent-success/20 text-accent-success border-accent-success/30',
  yellow: 'bg-accent-warning/20 text-accent-warning border-accent-warning/30',
  red: 'bg-accent-danger/20 text-accent-danger border-accent-danger/30',
  grey: 'bg-bg-elevated text-text-secondary border-bg-border',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({ children, color = 'purple', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}
