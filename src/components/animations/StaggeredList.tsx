import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StaggeredListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function StaggeredList({ 
  children, 
  className = '',
  staggerDelay = 0.1,
}: StaggeredListProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children.map((child, index) => (
        <motion.div 
          key={index} 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: 'spring' as const,
                stiffness: 100,
                damping: 12,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
