import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PulsingDotProps {
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colors = {
  primary: 'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  destructive: 'bg-destructive',
};

const sizes = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
};

export function PulsingDot({ 
  color = 'primary', 
  size = 'md',
  className = '' 
}: PulsingDotProps) {
  return (
    <span className={cn("relative flex", sizes[size], className)}>
      <motion.span
        className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", colors[color])}
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.75, 0, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <span className={cn("relative inline-flex rounded-full", sizes[size], colors[color])} />
    </span>
  );
}
