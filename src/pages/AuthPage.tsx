import { motion } from 'framer-motion';
import { AuthForm } from '@/components/auth/AuthForm';
import { Hexagon, Sparkles, Users, Zap, Trophy } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex bg-background hex-pattern overflow-hidden">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10 items-center justify-center p-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-4xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-4xl"
          />
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="relative">
              <Hexagon className="h-14 w-14 text-primary fill-primary/20" strokeWidth={1.5} />
              <Sparkles className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
            </div>
            <span className="text-4xl font-bold gradient-text">SKILLSPHERE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold leading-tight mb-4"
          >
            Discover. Connect.{' '}
            <span className="gradient-text">Innovate.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-12"
          >
            Your gateway to hackathons, skill-based team matching, and collaborative innovation.
          </motion.p>

          {/* Feature cards */}
          <div className="space-y-4">
            {[
              { icon: Trophy, title: '30+ Hackathons', desc: 'Curated challenges for all skill levels' },
              { icon: Users, title: 'Smart Team Matching', desc: 'Find teammates based on skills & education' },
              { icon: Zap, title: 'Personalized Recommendations', desc: 'Hackathons that match your expertise' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden flex items-center justify-center gap-2 mb-8"
          >
            <Hexagon className="h-10 w-10 text-primary fill-primary/20" strokeWidth={1.5} />
            <span className="text-2xl font-bold gradient-text">SKILLSPHERE</span>
          </motion.div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
