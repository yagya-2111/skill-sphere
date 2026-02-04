import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, MapPin, Trophy, ArrowRight, Zap, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface RecommendedHackathonCardProps {
  hackathon: Hackathon;
  matchingSkills: string[];
  index: number;
}

export function RecommendedHackathonCard({ hackathon, matchingSkills, index }: RecommendedHackathonCardProps) {
  const matchPercentage = Math.round((matchingSkills.length / hackathon.skills_required.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-2xl overflow-hidden group relative"
    >
      {/* Glow effect on hover */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, hsl(38 92% 50% / 0.15), transparent 60%)',
        }}
      />
      
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        {hackathon.image_url ? (
          <motion.img
            src={hackathon.image_url}
            alt={hackathon.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <motion.div 
            className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        
        {/* Match badge - animated */}
        <motion.div 
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="h-3 w-3" />
          </motion.div>
          {matchPercentage}% Match
        </motion.div>
        
        {/* Status badge */}
        <motion.div 
          className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md flex items-center gap-1.5 ${
            hackathon.status === 'Upcoming' ? 'badge-upcoming' :
            hackathon.status === 'Ongoing' ? 'badge-ongoing' : 'badge-completed'
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          {hackathon.status === 'Ongoing' && <PulsingDot color="warning" size="sm" />}
          {hackathon.status}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <motion.h3 
          className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {hackathon.title}
        </motion.h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{hackathon.description}</p>

        {/* Matching skills with icons */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Your matching skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchingSkills.slice(0, 3).map((skill, i) => (
              <motion.span 
                key={skill} 
                className="skill-tag text-[10px] py-0.5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
              >
                {skill}
              </motion.span>
            ))}
            {matchingSkills.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">+{matchingSkills.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05, color: 'hsl(var(--primary))' }}
          >
            <Calendar className="h-3 w-3" />
            {format(new Date(hackathon.start_date), 'MMM d')}
          </motion.div>
          {hackathon.prize_pool && (
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="h-3 w-3 text-primary" />
              <span className="text-primary font-semibold">{hackathon.prize_pool}</span>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <Link to={`/hackathons`}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full btn-honey group/btn" size="sm">
              View Details
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}
