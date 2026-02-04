import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedGradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
}

export function AnimatedGradientBorder({ 
  children, 
  className = '',
  borderWidth = 2,
  duration = 3,
}: AnimatedGradientBorderProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, hsl(38 92% 50%), hsl(270 70% 55%), hsl(174 72% 50%), hsl(38 92% 50%))',
          backgroundSize: '300% 100%',
          padding: borderWidth,
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="w-full h-full bg-card rounded-2xl" />
      </motion.div>
      
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
