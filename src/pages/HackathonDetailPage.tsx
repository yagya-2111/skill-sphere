import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Check,
  Loader2,
  Sparkles,
  Clock,
  ArrowLeft,
  Globe,
  Building,
  Target,
  Zap,
  Share2,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { GlowingOrb, ShimmerButton, PulsingDot, AnimatedCounter } from '@/components/animations';
import { SKILL_OPTIONS } from '@/lib/constants';

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

export default function HackathonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { toast } = useToast();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentCount, setEnrollmentCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchHackathon();
      fetchEnrollmentStatus();
      fetchEnrollmentCount();
    }
  }, [id, profile]);

  const fetchHackathon = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setHackathon(data);
    } catch (error) {
      console.error('Error fetching hackathon:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hackathon details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollmentStatus = async () => {
    if (!profile || !id) return;

    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', profile.id)
      .eq('hackathon_id', id)
      .maybeSingle();

    if (!error && data) {
      setIsEnrolled(true);
    }
  };

  const fetchEnrollmentCount = async () => {
    if (!id) return;

    const { count, error } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('hackathon_id', id);

    if (!error && count !== null) {
      setEnrollmentCount(count);
    }
  };

  const handleEnroll = async () => {
    if (!profile || !id || isEnrolled || enrolling) return;

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: profile.id,
          hackathon_id: id,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already enrolled',
            description: 'You are already enrolled in this hackathon',
          });
          setIsEnrolled(true);
        } else {
          throw error;
        }
        return;
      }

      setIsEnrolled(true);
      setEnrollmentCount(prev => prev + 1);
      toast({
        title: 'Enrolled successfully! 🎉',
        description: 'You have been enrolled in this hackathon.',
      });
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: 'Error',
        description: 'Failed to enroll. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setEnrolling(false);
    }
  };

  const getDaysRemaining = () => {
    if (!hackathon) return 0;
    const start = new Date(hackathon.start_date);
    const now = new Date();
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getStatusBadgeClass = () => {
    if (!hackathon) return '';
    switch (hackathon.status) {
      case 'Upcoming': return 'badge-upcoming';
      case 'Ongoing': return 'badge-ongoing';
      case 'Completed': return 'badge-completed';
      default: return '';
    }
  };

  const getModeBadgeClass = () => {
    if (!hackathon) return '';
    switch (hackathon.mode) {
      case 'Online': return 'badge-online';
      case 'Offline': return 'badge-offline';
      case 'Hybrid': return 'badge-hybrid';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-20 w-full mb-6" />
          <div className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!hackathon) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12"
          >
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Hackathon Not Found</h2>
            <p className="text-muted-foreground mb-6">The hackathon you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/hackathons')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hackathons
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto relative">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingOrb size="xl" color="primary" className="top-0 right-0 opacity-20" />
          <GlowingOrb size="lg" color="secondary" className="bottom-1/3 left-0 opacity-15" />
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/hackathons')}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hackathons
          </Button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8"
        >
          {hackathon.image_url ? (
            <img
              src={hackathon.image_url}
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-md flex items-center gap-2 ${getStatusBadgeClass()}`}
            >
              {hackathon.status === 'Ongoing' && <PulsingDot color="warning" size="sm" />}
              {hackathon.status === 'Upcoming' && <PulsingDot color="success" size="sm" />}
              {hackathon.status}
            </motion.span>
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-md ${getModeBadgeClass()}`}
            >
              {hackathon.mode}
            </motion.span>
          </div>

          {/* Prize Pool */}
          {hackathon.prize_pool && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-lg"
            >
              <Trophy className="h-4 w-4" />
              {hackathon.prize_pool}
            </motion.div>
          )}

          {/* Enrolled Badge */}
          {isEnrolled && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white font-bold shadow-lg"
            >
              <Check className="h-4 w-4" />
              You're Enrolled!
            </motion.div>
          )}
        </motion.div>

        {/* Title & Organizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
          {hackathon.organizer && (
            <p className="text-muted-foreground flex items-center gap-2">
              <Building className="h-4 w-4" />
              Organized by <span className="text-primary font-medium">{hackathon.organizer}</span>
            </p>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-semibold">{format(new Date(hackathon.start_date), 'MMM d, yyyy')}</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <p className="text-sm text-muted-foreground">Days Left</p>
            <p className="font-semibold">
              <AnimatedCounter value={getDaysRemaining()} duration={1} />
            </p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-secondary" />
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="font-semibold">
              <AnimatedCounter value={enrollmentCount} duration={1} />
            </p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
            <p className="text-sm text-muted-foreground">Team Size</p>
            <p className="font-semibold">{hackathon.max_team_size || 'Unlimited'}</p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Description & Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                About This Hackathon
              </h2>
              <p className="text-muted-foreground leading-relaxed">{hackathon.description}</p>
            </div>

            {/* Required Skills */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {hackathon.skills_required.map((skill, i) => {
                  const skillInfo = SKILL_OPTIONS.find(s => s.value === skill);
                  const hasSkill = profile?.skills.includes(skill);
                  return (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05, type: 'spring' }}
                      whileHover={{ scale: 1.1 }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        hasSkill
                          ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                          : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                      }`}
                    >
                      {hasSkill && <Check className="h-3 w-3 inline mr-1" />}
                      {skillInfo?.label || skill}
                    </motion.span>
                  );
                })}
              </div>
              {profile && (
                <p className="text-xs text-muted-foreground mt-4">
                  <span className="text-emerald-500">✓</span> Skills you have are highlighted in green
                </p>
              )}
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                Timeline
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Start</p>
                  <p className="font-semibold">{format(new Date(hackathon.start_date), 'MMMM d, yyyy')}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-secondary rounded" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm text-muted-foreground">End</p>
                  <p className="font-semibold">{format(new Date(hackathon.end_date), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - CTA & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Enroll Card */}
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6">
                {hackathon.prize_pool && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="text-3xl font-bold gradient-text">{hackathon.prize_pool}</p>
                  </div>
                )}
                <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {enrollmentCount} enrolled
                  </span>
                  {hackathon.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {hackathon.location}
                    </span>
                  )}
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <ShimmerButton
                  onClick={handleEnroll}
                  disabled={isEnrolled || enrolling || hackathon.status === 'Completed'}
                  className={`w-full h-14 text-lg ${isEnrolled ? 'bg-emerald-500 hover:bg-emerald-500' : ''}`}
                >
                  {enrolling ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isEnrolled ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Enrolled
                    </>
                  ) : hackathon.status === 'Completed' ? (
                    'Hackathon Ended'
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Enroll Now
                    </>
                  )}
                </ShimmerButton>
              </motion.div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Mode Info */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {hackathon.mode === 'Online' ? (
                  <Globe className="h-5 w-5 text-cyan-500" />
                ) : (
                  <MapPin className="h-5 w-5 text-purple-500" />
                )}
                {hackathon.mode} Event
              </h3>
              {hackathon.location && (
                <p className="text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {hackathon.location}
                </p>
              )}
              {hackathon.mode === 'Online' && (
                <p className="text-sm text-muted-foreground">
                  Participate from anywhere in the world!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
