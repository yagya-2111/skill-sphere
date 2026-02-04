import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FloatingIconsProps {
  icons: LucideIcon[];
  className?: string;
}

export function FloatingIcons({ icons, className = '' }: FloatingIconsProps) {
  const positions = [
    { top: '10%', left: '10%', rotate: -15 },
    { top: '20%', right: '15%', rotate: 10 },
    { top: '60%', left: '5%', rotate: 20 },
    { top: '70%', right: '10%', rotate: -10 },
    { top: '40%', left: '85%', rotate: 15 },
    { top: '85%', left: '20%', rotate: -20 },
    { top: '15%', left: '70%', rotate: 5 },
    { top: '50%', left: '2%', rotate: -5 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {icons.slice(0, 8).map((Icon, i) => {
        const pos = positions[i % positions.length];
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ ...pos }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1, 0.8],
              y: [0, -20, 0],
              rotate: [pos.rotate, pos.rotate + 10, pos.rotate],
            }}
            transition={{
              duration: 6 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="h-8 w-8 text-primary/30" strokeWidth={1} />
          </motion.div>
        );
      })}
    </div>
  );
}
