import { motion } from 'framer-motion';
import { format, differenceInDays, differenceInHours, isPast, isFuture } from 'date-fns';
import { Calendar, Clock, Wifi, Building2, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PulsingDot } from '@/components/animations';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  skills_required: string[];
  start_date: string;
  end_date: string;
  mode: string;
  status: string;
  image_url: string | null;
  prize_pool: string | null;
  organizer: string | null;
  location: string | null;
}

interface EnrolledHackathonCardProps {
  hackathon: Hackathon;
  index: number;
}

export function EnrolledHackathonCard({ hackathon, index }: EnrolledHackathonCardProps) {
  const now = new Date();
  const startDate = new Date(hackathon.start_date);
  const endDate = new Date(hackathon.end_date);
  
  // Calculate progress
  const totalDuration = differenceInHours(endDate, startDate);
  const elapsed = differenceInHours(now, startDate);
  const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  
  // Time remaining
  const daysRemaining = differenceInDays(endDate, now);
  const hoursRemaining = differenceInHours(endDate, now) % 24;

  const isOngoing = hackathon.status === 'Ongoing';
  const isUpcoming = hackathon.status === 'Upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ x: 4, scale: 1.02 }}
      className="group"
    >
      <Link to="/hackathons">
        <div className="relative p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/10 hover:to-primary/5 border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          {/* Status indicator */}
          <div className="absolute top-3 right-3">
            {isOngoing && <PulsingDot color="warning" size="sm" />}
            {isUpcoming && <PulsingDot color="success" size="sm" />}
          </div>
          
          <div className="flex items-start gap-3 relative z-10">
            {/* Icon */}
            <motion.div 
              className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                hackathon.mode === 'Online' 
                  ? 'bg-cyan-500/20 text-cyan-500' 
                  : 'bg-purple-500/20 text-purple-500'
              }`}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {hackathon.mode === 'Online' ? (
                <Wifi className="h-5 w-5" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
            </motion.div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {hackathon.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  isOngoing ? 'bg-amber-500/20 text-amber-500' :
                  isUpcoming ? 'bg-emerald-500/20 text-emerald-500' :
                  'bg-zinc-500/20 text-zinc-500'
                }`}>
                  {hackathon.status}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span>{hackathon.mode}</span>
              </div>
              
              {/* Progress bar for ongoing */}
              {isOngoing && (
                <div className="mt-3">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary" />
                      Progress
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {daysRemaining > 0 ? `${daysRemaining}d ${hoursRemaining}h left` : `${hoursRemaining}h left`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>
              )}
              
              {/* Countdown for upcoming */}
              {isUpcoming && (
                <motion.div 
                  className="mt-2 flex items-center gap-1 text-[10px] text-emerald-500"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock className="h-3 w-3" />
                  Starts {format(startDate, 'MMM d, yyyy')}
                </motion.div>
              )}
            </div>
            
            {/* Arrow */}
            <motion.div
              className="text-muted-foreground group-hover:text-primary transition-colors self-center"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
