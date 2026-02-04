import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { 
  Hexagon, 
  Sparkles, 
  Trophy, 
  Users, 
  Zap, 
  ArrowRight,
  Code,
  Rocket,
  Target,
  CheckCircle2,
  Cpu,
  Globe,
  Palette,
  Database,
  Cloud,
  Blocks,
  Brain,
  GitBranch
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { 
  AnimatedCounter, 
  ParticleField, 
  FloatingIcons, 
  TypewriterText,
  GlowingOrb,
  ShimmerButton,
  AnimatedGradientBorder,
  PulsingDot
} from '@/components/animations';

export default function LandingPage() {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const features = [
    {
      icon: Trophy,
      title: '30+ Hackathons',
      description: 'Curated challenges across AI, Web Dev, Blockchain, and more',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Smart Team Matching',
      description: 'Find teammates based on shared skills and education level',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'AI Recommendations',
      description: 'Get hackathon suggestions that match your expertise',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Target,
      title: 'Track Progress',
      description: 'Monitor enrolled hackathons with real-time updates',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const stats = [
    { value: 30, suffix: '+', label: 'Hackathons' },
    { value: 100, suffix: 'K+', label: 'Prize Pool' },
    { value: 9, suffix: '', label: 'Skill Categories' },
    { value: '∞', suffix: '', label: 'Opportunities' },
  ];

  const skillIcons = [Code, Cpu, Globe, Palette, Database, Cloud, Blocks, Brain];
  
  const typewriterTexts = [
    'AI/ML Challenges',
    'Web Development',
    'Blockchain Projects',
    'Cloud Computing',
    'UI/UX Design',
  ];

  const testimonials = [
    { name: 'Priya S.', role: 'BTech Student', text: 'Found my perfect team in minutes!', avatar: 'P' },
    { name: 'Rahul M.', role: 'MCA Graduate', text: 'Won 2 hackathons using SKILLSPHERE', avatar: 'R' },
    { name: 'Ananya K.', role: 'Full Stack Dev', text: 'The matching algorithm is brilliant', avatar: 'A' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <ParticleField count={60} className="fixed inset-0 z-0" />
      <FloatingIcons icons={skillIcons} className="fixed inset-0 z-0" />
      
      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Hexagon className="h-9 w-9 text-primary fill-primary/20" strokeWidth={1.5} />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
              </div>
              <span className="text-xl font-bold gradient-text">SKILLSPHERE</span>
            </motion.div>
            <Link to="/auth">
              <ShimmerButton className="h-10 px-6 text-sm">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Glowing orbs */}
        <GlowingOrb size="xl" color="primary" position="top-left" />
        <GlowingOrb size="lg" color="secondary" position="bottom-right" />
        <GlowingOrb size="md" color="accent" className="top-1/2 right-1/4" />

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <PulsingDot color="success" size="sm" />
              <span className="text-sm font-medium">Your Hackathon Journey Starts Here</span>
            </motion.div>

            {/* Main heading with typewriter */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="block mb-2">Discover. Connect. </span>
              <span className="gradient-text">
                <TypewriterText texts={typewriterTexts} typingSpeed={80} pauseDuration={2500} />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              SKILLSPHERE is your gateway to hackathons, skill-based team matching, 
              and collaborative innovation. Find your perfect hackathon and build with the best.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/auth">
                <ShimmerButton className="text-lg px-10 h-14 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </ShimmerButton>
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 btn-glass w-full sm:w-auto">
                  <Code className="mr-2 h-5 w-5" />
                  Browse Hackathons
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <p className="text-3xl md:text-4xl font-bold gradient-text">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4"
            >
              Features
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From discovering the perfect hackathon to finding teammates, we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <AnimatedGradientBorder key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-2xl p-6 h-full"
                >
                  <motion.div 
                    className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              </AnimatedGradientBorder>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Three Steps to <span className="gradient-text">Success</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and add your skills, education, and interests' },
              { step: '02', title: 'Discover Hackathons', desc: 'Browse curated hackathons matching your expertise' },
              { step: '03', title: 'Build Your Team', desc: 'Find perfect teammates with our smart matching algorithm' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center gap-6 mb-8 last:mb-0"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-2xl font-bold text-primary-foreground"
                >
                  {item.step}
                </motion.div>
                <div className="flex-1 glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                {i < 2 && (
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="hidden lg:block absolute right-1/2 translate-x-1/2"
                  >
                    <GitBranch className="h-6 w-6 text-muted-foreground rotate-180" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Loved by <span className="gradient-text">Innovators</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold"
                  >
                    {t.avatar}
                  </motion.div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            />
            <GlowingOrb size="lg" color="primary" position="top-left" className="opacity-50" />
            <GlowingOrb size="md" color="secondary" position="bottom-right" className="opacity-50" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-6 shadow-honey"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Rocket className="h-10 w-10 text-black" />
                </motion.div>
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to Start Your <span className="gradient-text">Hackathon Journey</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                Join SKILLSPHERE today and discover hackathons that match your skills. 
                Connect with like-minded innovators and build something amazing.
              </p>

              <Link to="/auth">
                <ShimmerButton className="text-lg px-10 h-14">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </ShimmerButton>
              </Link>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
              >
                {['Free to use', 'No credit card required', '30+ hackathons available'].map((item, i) => (
                  <motion.div 
                    key={item} 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 relative z-10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Hexagon className="h-6 w-6 text-primary fill-primary/20" strokeWidth={1.5} />
              <span className="font-bold gradient-text">SKILLSPHERE</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              © 2024 SKILLSPHERE. Built for innovators, by innovators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
