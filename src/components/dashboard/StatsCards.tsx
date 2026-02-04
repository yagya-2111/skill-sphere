import { motion } from 'framer-motion';
import { Trophy, Users, Zap, Target } from 'lucide-react';
import { AnimatedCounter } from '@/components/animations';

interface StatsCardsProps {
  enrolledCount: number;
  matchCount: number;
}

export function StatsCards({ enrolledCount, matchCount }: StatsCardsProps) {
  const stats = [
    {
      icon: Trophy,
      label: 'Hackathons',
      value: enrolledCount,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: Users,
      label: 'Team Matches',
      value: matchCount,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: Zap,
      label: 'Skills',
      value: 9,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: Target,
      label: 'Goals Met',
      value: 3,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`glass-card rounded-2xl p-4 ${stat.bgColor} border border-transparent hover:border-primary/20 transition-all cursor-default`}
        >
          <div className="flex items-center justify-between mb-3">
            <motion.div
              className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <stat.icon className="h-5 w-5 text-white" />
            </motion.div>
          </div>
          <div>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={stat.value} duration={1.5} />
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
