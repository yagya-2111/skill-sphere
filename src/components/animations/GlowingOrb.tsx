import { motion } from 'framer-motion';

interface GlowingOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  className?: string;
}

const sizes = {
  sm: 'w-48 h-48',
  md: 'w-72 h-72',
  lg: 'w-96 h-96',
  xl: 'w-[32rem] h-[32rem]',
};

const colors = {
  primary: 'bg-primary/30',
  secondary: 'bg-secondary/30',
  accent: 'bg-accent/30',
};

const positions = {
  'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

export function GlowingOrb({ 
  size = 'lg', 
  color = 'primary', 
  position = 'center',
  className = '' 
}: GlowingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${sizes[size]} ${colors[color]} ${positions[position]} ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
