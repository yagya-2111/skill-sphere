import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ShimmerButton({ 
  children, 
  className = '',
  onClick,
  disabled = false,
}: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "relative overflow-hidden px-8 py-4 rounded-xl font-semibold",
        "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500",
        "text-black shadow-lg",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          translateX: ['100%', '-100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'easeInOut',
        }}
      >
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      </motion.div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
