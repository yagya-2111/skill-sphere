import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { EnrolledHackathonCard } from '@/components/dashboard/EnrolledHackathonCard';
import { RecommendedHackathonCard } from '@/components/dashboard/RecommendedHackathonCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Zap, Users, ArrowRight, Sparkles, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlowingOrb, ShimmerButton } from '@/components/animations';

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

export default function Dashboard() {
  const { profile } = useAuthStore();
  const [enrolledHackathons, setEnrolledHackathons] = useState<Hackathon[]>([]);
  const [recommendedHackathons, setRecommendedHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      // Fetch enrolled hackathons
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          hackathon_id,
          hackathons (*)
        `)
        .eq('user_id', profile.id);

      if (!enrollError && enrollments) {
        const enrolled = enrollments
          .map((e: any) => e.hackathons)
          .filter(Boolean);
        setEnrolledHackathons(enrolled);
      }

      // Fetch recommended hackathons (matching user skills)
      const { data: hackathons, error: hackError } = await supabase
        .from('hackathons')
        .select('*')
        .in('status', ['Upcoming', 'Ongoing']);

      if (!hackError && hackathons) {
        // Filter hackathons that match at least one user skill
        const enrolledIds = new Set(enrolledHackathons.map(h => h.id));
        const recommended = hackathons
          .filter((h: Hackathon) => {
            if (enrolledIds.has(h.id)) return false;
            return h.skills_required.some(skill => profile.skills.includes(skill));
          })
          .slice(0, 6);
        setRecommendedHackathons(recommended);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchingSkills = (hackathon: Hackathon): string[] => {
    if (!profile) return [];
    return hackathon.skills_required.filter(skill => profile.skills.includes(skill));
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb size="lg" color="primary" className="top-0 right-0 opacity-30" />
          <GlowingOrb size="md" color="secondary" className="bottom-1/4 left-0 opacity-20" />
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium">Welcome back</span>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hello, <span className="gradient-text">{profile?.name?.split(' ')[0]}</span>! 
            <motion.span
              className="inline-block ml-2"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            >
              👋
            </motion.span>
          </h1>
          <p className="text-muted-foreground">
            Discover hackathons, connect with teammates, and build something amazing.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StatsCards enrolledCount={enrolledHackathons.length} matchCount={12} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {/* Left column - Profile & Enrolled */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <ProfileCard enrolledCount={enrolledHackathons.length} />

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-2xl p-5"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link to="/hackathons">
                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="ghost" className="w-full justify-start group">
                      <Trophy className="h-4 w-4 mr-3 text-primary" />
                      Browse All Hackathons
                      <motion.div 
                        className="ml-auto"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/team-match">
                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="ghost" className="w-full justify-start group">
                      <Users className="h-4 w-4 mr-3 text-secondary" />
                      Find Teammates
                      <motion.div 
                        className="ml-auto"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      >
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Enrolled Hackathons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  My Hackathons
                </h3>
                <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                  {enrolledHackathons.length} enrolled
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : enrolledHackathons.length > 0 ? (
                <div className="space-y-3">
                  {enrolledHackathons.slice(0, 3).map((hackathon, index) => (
                    <EnrolledHackathonCard
                      key={hackathon.id}
                      hackathon={hackathon}
                      index={index}
                    />
                  ))}
                  {enrolledHackathons.length > 3 && (
                    <Link to="/hackathons">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="ghost" size="sm" className="w-full">
                          View all {enrolledHackathons.length} hackathons
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground mb-3">
                    No hackathons enrolled yet
                  </p>
                  <Link to="/hackathons">
                    <ShimmerButton className="px-4 py-2 text-sm">
                      Browse Hackathons
                    </ShimmerButton>
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>

          {/* Right column - Recommendations */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap className="h-5 w-5 text-primary" />
                    </motion.div>
                    Recommended for You
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Based on your skills: {profile?.skills.slice(0, 3).join(', ')}
                    {profile?.skills && profile.skills.length > 3 && ` +${profile.skills.length - 3} more`}
                  </p>
                </div>
                <Link to="/hackathons">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" className="group">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-80 rounded-2xl" />
                  ))}
                </div>
              ) : recommendedHackathons.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedHackathons.map((hackathon, index) => (
                    <RecommendedHackathonCard
                      key={hackathon.id}
                      hackathon={hackathon}
                      matchingSkills={getMatchingSkills(hackathon)}
                      index={index}
                    />
                  ))}
                </div>
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
                    <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  </motion.div>
                  <h3 className="font-semibold mb-2">No recommendations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your profile with more skills to get personalized recommendations
                  </p>
                  <Link to="/profile">
                    <ShimmerButton className="px-6 py-3">
                      Update Skills
                    </ShimmerButton>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
