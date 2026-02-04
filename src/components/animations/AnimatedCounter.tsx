import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  className = '',
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Handle string values like "100K+" or "∞"
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const isNumeric = !isNaN(numericValue) && isFinite(numericValue);
  
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView && isNumeric) {
      spring.set(numericValue);
    }
  }, [isInView, numericValue, spring, isNumeric]);

  useEffect(() => {
    if (isNumeric) {
      const unsubscribe = display.on("change", (latest) => {
        setDisplayValue(latest);
      });
      return unsubscribe;
    }
  }, [display, isNumeric]);

  if (!isNumeric) {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={className}
      >
        {prefix}{value}{suffix}
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      className={className}
    >
      {prefix}{displayValue}{typeof value === 'string' ? value.replace(/[0-9.]/g, '') : ''}{suffix}
    </motion.span>
  );
}
