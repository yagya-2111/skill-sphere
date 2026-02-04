import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { HackathonCard } from '@/components/hackathons/HackathonCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, X, Trophy, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { SKILL_OPTIONS } from '@/lib/constants';
import { GlowingOrb, AnimatedCounter, ShimmerButton } from '@/components/animations';

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

export default function HackathonsPage() {
  const { profile } = useAuthStore();
  const { toast } = useToast();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHackathons();
    if (profile) {
      fetchEnrollments();
    }
  }, [profile]);

  const fetchHackathons = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('start_date', { ascending: true });

      if (!error && data) {
        setHackathons(data);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('enrollments')
      .select('hackathon_id')
      .eq('user_id', profile.id);

    if (!error && data) {
      setEnrolledIds(new Set(data.map(e => e.hackathon_id)));
    }
  };

  const handleEnroll = async (hackathonId: string) => {
    if (!profile) return;

    const { error } = await supabase
      .from('enrollments')
      .insert({
        user_id: profile.id,
        hackathon_id: hackathonId,
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already enrolled',
          description: 'You are already enrolled in this hackathon',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to enroll. Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }

    setEnrolledIds(prev => new Set([...prev, hackathonId]));
    toast({
      title: 'Enrolled successfully! 🎉',
      description: 'You have been enrolled in this hackathon.',
    });
  };

  // Filter hackathons
  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || hackathon.status === selectedStatus;
    const matchesMode = !selectedMode || hackathon.mode === selectedMode;
    const matchesSkill = !selectedSkill || hackathon.skills_required.includes(selectedSkill);

    return matchesSearch && matchesStatus && matchesMode && matchesSkill;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus(null);
    setSelectedMode(null);
    setSelectedSkill(null);
  };

  const hasActiveFilters = searchQuery || selectedStatus || selectedMode || selectedSkill;

  const statusOptions = [
    { value: 'Upcoming', color: 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' },
    { value: 'Ongoing', color: 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' },
    { value: 'Completed', color: 'bg-zinc-500/20 text-zinc-500 hover:bg-zinc-500/30' },
  ];

  const modeOptions = [
    { value: 'Online', color: 'bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30' },
    { value: 'Offline', color: 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30' },
    { value: 'Hybrid', color: 'bg-pink-500/20 text-pink-500 hover:bg-pink-500/30' },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb size="lg" color="primary" className="top-0 right-0 opacity-20" />
          <GlowingOrb size="md" color="secondary" className="bottom-1/3 left-0 opacity-15" />
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
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium">{hackathons.length} hackathons available</span>
          </motion.div>
          
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Discover <span className="gradient-text">Hackathons</span>
            </h1>
          </div>
          <p className="text-muted-foreground">
            Explore and enroll in exciting hackathons that match your skills
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
            { label: 'Total', value: hackathons.length, icon: Trophy, color: 'text-primary' },
            { label: 'Enrolled', value: enrolledIds.size, icon: Sparkles, color: 'text-emerald-500' },
            { label: 'Ongoing', value: hackathons.filter(h => h.status === 'Ongoing').length, icon: TrendingUp, color: 'text-amber-500' },
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

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 relative z-10"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hackathons..."
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
                className="glass-card rounded-2xl p-5 space-y-5 overflow-hidden"
              >
                {/* Status filter */}
                <div>
                  <p className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <motion.button
                        key={status.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedStatus(selectedStatus === status.value ? null : status.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedStatus === status.value 
                            ? 'bg-primary text-primary-foreground' 
                            : status.color
                        }`}
                      >
                        {status.value}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mode filter */}
                <div>
                  <p className="text-sm font-medium mb-3">Mode</p>
                  <div className="flex flex-wrap gap-2">
                    {modeOptions.map((mode) => (
                      <motion.button
                        key={mode.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMode(selectedMode === mode.value ? null : mode.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedMode === mode.value 
                            ? 'bg-primary text-primary-foreground' 
                            : mode.color
                        }`}
                      >
                        {mode.value}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Skills filter */}
                <div>
                  <p className="text-sm font-medium mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <motion.button
                        key={skill.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSkill(selectedSkill === skill.value ? null : skill.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedSkill === skill.value 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        {skill.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters} 
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredHackathons.length}</span> of{' '}
            <span className="font-semibold text-foreground">{hackathons.length}</span> hackathons
          </p>
        </motion.div>

        {/* Hackathon Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : filteredHackathons.length > 0 ? (
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
            {filteredHackathons.map((hackathon, index) => (
              <HackathonCard
                key={hackathon.id}
                hackathon={hackathon}
                isEnrolled={enrolledIds.has(hackathon.id)}
                onEnroll={handleEnroll}
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
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            </motion.div>
            <h3 className="font-semibold mb-2">No hackathons found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <ShimmerButton onClick={clearFilters} className="px-6 py-3 text-sm">
              Clear Filters
            </ShimmerButton>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
