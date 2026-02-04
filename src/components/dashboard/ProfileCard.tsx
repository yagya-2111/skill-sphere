import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { SKILL_OPTIONS } from '@/lib/constants';
import { GraduationCap, Mail, Edit, Trophy, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedCounter, PulsingDot } from '@/components/animations';

interface ProfileCardProps {
  enrolledCount: number;
}

export function ProfileCard({ enrolledCount }: ProfileCardProps) {
  const { profile } = useAuthStore();

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Animated Avatar */}
            <motion.div 
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black text-2xl font-bold shadow-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-3 w-3 text-white" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h2 
                className="text-xl font-bold"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {profile.name}
              </motion.h2>
              <motion.div 
                className="flex items-center gap-2 text-muted-foreground text-sm mt-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GraduationCap className="h-4 w-4" />
                {profile.education}
              </motion.div>
            </div>
          </div>
          
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }}>
            <Link 
              to="/profile"
              className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
            >
              <Edit className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Email */}
        <motion.div 
          className="flex items-center gap-2 text-muted-foreground text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Mail className="h-4 w-4" />
          {profile.email}
        </motion.div>

        {/* Skills with staggered animation */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => {
              const skillInfo = SKILL_OPTIONS.find(s => s.value === skill);
              return (
                <motion.span 
                  key={skill} 
                  className="skill-tag cursor-default"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {skillInfo?.label || skill}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* Stats with animated counters */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <motion.div 
            className="text-center p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-default"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold gradient-text">
              <AnimatedCounter value={enrolledCount} duration={1.5} />
            </p>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </motion.div>
          <motion.div 
            className="text-center p-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-default"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-3xl font-bold gradient-text">
              <AnimatedCounter value={profile.skills.length} duration={1.5} />
            </p>
            <p className="text-xs text-muted-foreground">Skills</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
