import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Trophy, Users, Check, Loader2, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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
  max_team_size: number | null;
}

interface HackathonCardProps {
  hackathon: Hackathon;
  isEnrolled: boolean;
  onEnroll: (hackathonId: string) => Promise<void>;
  index: number;
}

export function HackathonCard({ hackathon, isEnrolled, onEnroll, index }: HackathonCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnrolled || isLoading) return;
    setIsLoading(true);
    try {
      await onEnroll(hackathon.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/hackathons/${hackathon.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 80 }}
      whileHover={{ y: -8 }}
      className="glass-card rounded-2xl overflow-hidden group relative"
    >
      {/* Glow effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, hsl(38 92% 50% / 0.2), transparent 60%)',
        }}
      />
      
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {hackathon.image_url ? (
          <motion.img
            src={hackathon.image_url}
            alt={hackathon.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <motion.div 
            className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <motion.span 
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md flex items-center gap-1.5 ${
              hackathon.status === 'Upcoming' ? 'badge-upcoming' :
              hackathon.status === 'Ongoing' ? 'badge-ongoing' : 'badge-completed'
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            {hackathon.status === 'Ongoing' && <PulsingDot color="warning" size="sm" />}
            {hackathon.status === 'Upcoming' && <PulsingDot color="success" size="sm" />}
            {hackathon.status}
          </motion.span>
          <motion.span 
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${
              hackathon.mode === 'Online' ? 'badge-online' :
              hackathon.mode === 'Offline' ? 'badge-offline' : 'badge-hybrid'
            }`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 + index * 0.05 }}
          >
            {hackathon.mode}
          </motion.span>
        </div>

        {/* Prize pool badge */}
        {hackathon.prize_pool && (
          <motion.div 
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
          >
            <Trophy className="h-3.5 w-3.5" />
            {hackathon.prize_pool}
          </motion.div>
        )}

        {/* Enrolled badge */}
        {isEnrolled && (
          <motion.div 
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Check className="h-3.5 w-3.5" />
            </motion.div>
            Enrolled
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Organizer */}
        <div className="mb-3">
          <motion.h3 
            className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {hackathon.title}
          </motion.h3>
          {hackathon.organizer && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              by <span className="text-primary">{hackathon.organizer}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {hackathon.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {hackathon.skills_required.slice(0, 4).map((skill, i) => (
              <motion.span 
                key={skill} 
                className="skill-tag text-[11px]"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {skill}
              </motion.span>
            ))}
            {hackathon.skills_required.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{hackathon.skills_required.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-5">
          <motion.div 
            className="flex items-center gap-1.5"
            whileHover={{ scale: 1.05, color: 'hsl(var(--primary))' }}
          >
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(hackathon.start_date), 'MMM d')} - {format(new Date(hackathon.end_date), 'MMM d, yyyy')}
          </motion.div>
          {hackathon.location && (
            <motion.div 
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="h-3.5 w-3.5" />
              {hackathon.location}
            </motion.div>
          )}
          {hackathon.max_team_size && (
            <motion.div 
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="h-3.5 w-3.5" />
              Max {hackathon.max_team_size} members
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleViewDetails}
              variant="outline"
              className="w-full gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </motion.div>
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleEnroll}
              disabled={isEnrolled || isLoading || hackathon.status === 'Completed'}
              className={`w-full relative overflow-hidden ${isEnrolled ? 'bg-emerald-500 hover:bg-emerald-500' : 'btn-honey'}`}
            >
              {/* Shimmer effect */}
              {!isEnrolled && !isLoading && (
                <motion.div
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ translateX: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEnrolled ? (
                  <>
                    <Check className="h-4 w-4" />
                    Enrolled
                  </>
                ) : hackathon.status === 'Completed' ? (
                  'Ended'
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Enroll
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
