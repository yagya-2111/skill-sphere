export const EDUCATION_LEVELS = [
  { value: 'BTech', label: 'B.Tech' },
  { value: 'MTech', label: 'M.Tech' },
  { value: 'BCA', label: 'BCA' },
  { value: 'MCA', label: 'MCA' },
  { value: 'BSc', label: 'B.Sc (Computer Science)' },
  { value: 'MSc', label: 'M.Sc (Computer Science)' },
  { value: 'Others', label: 'Others' },
] as const;

export const SKILL_OPTIONS = [
  { value: 'UI/UX', label: 'UI/UX', color: 'from-pink-500 to-rose-500' },
  { value: 'Frontend', label: 'Frontend', color: 'from-cyan-500 to-blue-500' },
  { value: 'Backend', label: 'Backend', color: 'from-green-500 to-emerald-500' },
  { value: 'Full Stack', label: 'Full Stack', color: 'from-violet-500 to-purple-500' },
  { value: 'Web Development', label: 'Web Development', color: 'from-orange-500 to-amber-500' },
  { value: 'Cloud Computing', label: 'Cloud Computing', color: 'from-sky-500 to-indigo-500' },
  { value: 'Blockchain', label: 'Blockchain', color: 'from-yellow-500 to-orange-500' },
  { value: 'Artificial Intelligence', label: 'AI', color: 'from-fuchsia-500 to-pink-500' },
  { value: 'Machine Learning', label: 'ML', color: 'from-teal-500 to-cyan-500' },
] as const;

export type EducationLevel = typeof EDUCATION_LEVELS[number]['value'];
export type Skill = typeof SKILL_OPTIONS[number]['value'];
