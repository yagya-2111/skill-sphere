import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Filter, Sparkles, X, Zap, UserPlus, TrendingUp } from 'lucide-react';
import { EDUCATION_LEVELS, SKILL_OPTIONS } from '@/lib/constants';
import { GlowingOrb, AnimatedCounter, ShimmerButton } from '@/components/animations';

interface Profile {
  id: string;
  name: string;
  email: string;
  education: string;
  skills: string[];
}

interface MatchedProfile extends Profile {
  matchPercentage: number;
  commonSkills: string[];
}

export default function TeamMatchPage() {
  const { profile } = useAuthStore();
  const { fetchInvitations, subscribeToInvitations } = useInvitationStore();
  const [matchedProfiles, setMatchedProfiles] = useState<MatchedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchMatchedProfiles();
      fetchInvitations(profile.id);
      const unsubscribe = subscribeToInvitations(profile.id);
      return unsubscribe;
    }
  }, [profile]);

  const fetchMatchedProfiles = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      // Fetch all profiles except current user
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', profile.id);

      if (!error && data) {
        // Calculate match percentage and filter
        const matched = data
          .map((p: Profile) => {
            const commonSkills = p.skills.filter(skill => profile.skills.includes(skill));
            const matchPercentage = p.skills.length > 0 
              ? Math.round((commonSkills.length / Math.min(p.skills.length, profile.skills.length)) * 100)
              : 0;

            return {
              ...p,
              matchPercentage,
              commonSkills,
            };
          })
          .filter((p: MatchedProfile) => p.commonSkills.length > 0)
          .sort((a: MatchedProfile, b: MatchedProfile) => b.matchPercentage - a.matchPercentage);

        setMatchedProfiles(matched);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter profiles
  const filteredProfiles = matchedProfiles.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEducation = !selectedEducation || p.education === selectedEducation;

    return matchesSearch && matchesEducation;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEducation(null);
  };

  const hasActiveFilters = searchQuery || selectedEducation;
  const highMatches = filteredProfiles.filter(p => p.matchPercentage >= 70).length;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb size="lg" color="secondary" className="top-0 right-0 opacity-20" />
          <GlowingOrb size="md" color="primary" className="bottom-1/4 left-0 opacity-15" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-4"
          >
            <UserPlus className="h-3 w-3 text-secondary" />
            <span className="text-xs font-medium">Smart matching enabled</span>
          </motion.div>
          
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Users className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Find Your <span className="gradient-text">Dream Team</span>
            </h1>
          </div>
          <p className="text-muted-foreground">
            Connect with teammates who share your skills and passion for innovation
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Matches', value: matchedProfiles.length, icon: Users, color: 'text-primary' },
            { label: 'High Match', value: highMatches, icon: Zap, color: 'text-emerald-500' },
            { label: 'Your Skills', value: profile?.skills.length || 0, icon: Sparkles, color: 'text-amber-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-xl p-4 text-center cursor-default"
            >
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">
                <AnimatedCounter value={stat.value} duration={1} />
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Your Skills Banner */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-5 mb-8 relative overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
                <p className="text-sm font-medium">Matching based on your expertise</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => {
                  const skillInfo = SKILL_OPTIONS.find(s => s.value === skill);
                  return (
                    <motion.span 
                      key={skill} 
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, type: 'spring' }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      {skillInfo?.label || skill}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8 relative z-10"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Filter toggle */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 gap-2 rounded-xl px-6"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center"
                  >
                    !
                  </motion.span>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Filter chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-5 overflow-hidden"
              >
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Education Level
                </p>
                <div className="flex flex-wrap gap-2">
                  {EDUCATION_LEVELS.map((edu) => (
                    <motion.button
                      key={edu.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEducation(selectedEducation === edu.value ? null : edu.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedEducation === edu.value 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {edu.label}
                    </motion.button>
                  ))}
                </div>

                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters} 
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear filters
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredProfiles.length}</span> potential teammates
          </p>
          {highMatches > 0 && (
            <motion.div 
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-3 w-3" />
              {highMatches} high matches!
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : filteredProfiles.length > 0 ? (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
          >
            {filteredProfiles.map((matchedProfile, index) => (
              <TeamMemberCard
                key={matchedProfile.id}
                profile={matchedProfile}
                matchPercentage={matchedProfile.matchPercentage}
                commonSkills={matchedProfile.commonSkills}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="glass-card rounded-2xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            </motion.div>
            <h3 className="font-semibold mb-2">No matches found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {matchedProfiles.length === 0
                ? "There are no other users with matching skills yet. Invite your friends to join SKILLSPHERE!"
                : "Try adjusting your filters to find more teammates"}
            </p>
            {hasActiveFilters && (
              <ShimmerButton onClick={clearFilters} className="px-6 py-3 text-sm">
                Clear Filters
              </ShimmerButton>
            )}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
