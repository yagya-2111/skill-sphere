import { motion } from 'framer-motion';
import { SKILL_OPTIONS } from '@/lib/constants';
import { GraduationCap, Sparkles, UserPlus, MessageCircle, Star, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  name: string;
  email: string;
  education: string;
  skills: string[];
}

interface TeamMemberCardProps {
  profile: Profile;
  matchPercentage: number;
  commonSkills: string[];
  index: number;
}

export function TeamMemberCard({ profile, matchPercentage, commonSkills, index }: TeamMemberCardProps) {
  const { profile: currentUser } = useAuthStore();
  const { sendInvitation, sentInvitations } = useInvitationStore();
  const { toast } = useToast();
  const [isInviting, setIsInviting] = useState(false);
  
  // Check if already invited
  const isAlreadyInvited = sentInvitations.some(
    inv => inv.to_user_id === profile.id && inv.status !== 'declined'
  );
  
  const getMatchColor = () => {
    if (matchPercentage >= 80) return 'from-emerald-500 to-green-500';
    if (matchPercentage >= 60) return 'from-amber-500 to-orange-500';
    return 'from-blue-500 to-cyan-500';
  };

  const handleInvite = async () => {
    if (!currentUser || isAlreadyInvited || isInviting) return;
    
    setIsInviting(true);
    const success = await sendInvitation(currentUser.id, profile.id);
    
    if (success) {
      toast({
        title: 'Invitation Sent! 🎉',
        description: `You invited ${profile.name} to join your team.`,
      });
    } else {
      toast({
        title: 'Already Invited',
        description: 'You have already sent an invitation to this user.',
        variant: 'destructive',
      });
    }
    setIsInviting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 80 }}
      whileHover={{ y: -8 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Animated background gradient based on match */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, hsl(38 92% 50% / ${matchPercentage / 200}), transparent)`,
        }}
      />
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Animated Avatar */}
            <motion.div 
              className="relative"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black text-xl font-bold shadow-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              {matchPercentage >= 80 && (
                <motion.div
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Star className="h-3 w-3 text-white" fill="white" />
                </motion.div>
              )}
            </motion.div>
            <div>
              <motion.h3 
                className="font-bold text-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {profile.name}
              </motion.h3>
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <GraduationCap className="h-4 w-4" />
                {profile.education}
              </motion.div>
            </div>
          </div>

          {/* Match percentage - animated ring */}
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/20"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#matchGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 176' }}
                  animate={{ strokeDasharray: `${matchPercentage * 1.76} 176` }}
                  transition={{ duration: 1.5, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(38 92% 50%)" />
                    <stop offset="100%" stopColor="hsl(24 95% 53%)" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="text-lg font-bold">{matchPercentage}%</span>
              </motion.div>
            </div>
            <span className="text-xs text-muted-foreground mt-1">Match</span>
          </div>
        </div>

        {/* Common Skills */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
            </motion.div>
            Common Skills ({commonSkills.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {commonSkills.map((skill, i) => {
              const skillInfo = SKILL_OPTIONS.find(s => s.value === skill);
              return (
                <motion.span 
                  key={skill} 
                  className="skill-tag text-[11px]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.15, y: -2 }}
                >
                  {skillInfo?.label || skill}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* All Skills */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2">All Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill, i) => {
              const isCommon = commonSkills.includes(skill);
              const skillInfo = SKILL_OPTIONS.find(s => s.value === skill);
              return (
                <motion.span 
                  key={skill} 
                  className={`px-2 py-0.5 text-[11px] rounded-full border transition-all ${
                    isCommon 
                      ? 'bg-primary/10 text-primary border-primary/20' 
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skillInfo?.label || skill}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className={`w-full ${isAlreadyInvited ? 'bg-emerald-500 hover:bg-emerald-500' : 'btn-honey'}`}
              size="sm"
              onClick={handleInvite}
              disabled={isAlreadyInvited || isInviting}
            >
              {isInviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAlreadyInvited ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                  <span className="ml-1">Invited</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite to Team
                </>
              )}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" className="px-3">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
