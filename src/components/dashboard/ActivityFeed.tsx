import { motion } from 'framer-motion';
import { Hexagon, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';
import { AnimatedCounter } from '@/components/animations';

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'match' | 'achievement';
  title: string;
  description: string;
  time: string;
}

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'enrollment',
    title: 'New Enrollment',
    description: 'You enrolled in AI Innovation Challenge',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'match',
    title: 'Team Match Found',
    description: '85% match with Priya (Full Stack)',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'First hackathon enrollment!',
    time: '1 day ago',
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'enrollment':
      return <Hexagon className="h-4 w-4" />;
    case 'match':
      return <Sparkles className="h-4 w-4" />;
    case 'achievement':
      return <Award className="h-4 w-4" />;
    default:
      return <TrendingUp className="h-4 w-4" />;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'enrollment':
      return 'bg-primary/20 text-primary';
    case 'match':
      return 'bg-secondary/20 text-secondary';
    case 'achievement':
      return 'bg-emerald-500/20 text-emerald-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Recent Activity
        </h3>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ x: 4 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-default"
          >
            <div className={`flex-shrink-0 h-8 w-8 rounded-lg ${getColor(activity.type)} flex items-center justify-center`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {activity.time}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
