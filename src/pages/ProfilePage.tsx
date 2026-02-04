import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { EDUCATION_LEVELS, SKILL_OPTIONS } from '@/lib/constants';
import { User, Mail, GraduationCap, Check, Loader2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { profile, fetchProfile } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    education: 'BTech',
    skills: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        education: profile.education,
        skills: profile.skills,
      });
    }
  }, [profile]);

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (formData.skills.length === 0) {
      toast({
        title: 'Skills required',
        description: 'Please select at least one skill',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          education: formData.education,
          skills: formData.skills,
        })
        .eq('id', profile.id);

      if (error) {
        throw error;
      }

      await fetchProfile(profile.id);

      toast({
        title: 'Profile updated! ✨',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your profile information and skills
          </p>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-8"
        >
          {/* Avatar section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black text-3xl font-bold shadow-honey">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {profile.email}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-muted-foreground">(cannot be changed)</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="pl-10 opacity-60"
                />
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm font-medium">
                Education Level
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Skills <span className="text-muted-foreground">(select your expertise)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <motion.button
                    key={skill.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                      formData.skills.includes(skill.value)
                        ? 'bg-primary text-primary-foreground border-primary shadow-honey'
                        : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {formData.skills.includes(skill.value) && (
                      <Check className="inline h-4 w-4 mr-1" />
                    )}
                    {skill.label}
                  </motion.button>
                ))}
              </div>
              {formData.skills.length === 0 && (
                <p className="text-xs text-destructive">Please select at least one skill</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-honey h-11"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
}
