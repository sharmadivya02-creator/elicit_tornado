// Dev Team placeholder data — edit this single file to replace all developer information.
// Do NOT hardcode developer info inside components.

export interface DevTeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  github: string;
  linkedin: string;
  email?: string;
  techStack: string[];
  status: 'online' | 'away' | 'offline';
  color: string;
  shadow: string;
  bg: string;
}

export interface DevTechItem {
  name: string;
  icon: string; // emoji
  category: 'frontend' | 'backend' | 'devops' | 'language';
  color: string;
}

export interface DevAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// ─── PLACEHOLDER DEVELOPER DATA ───────────────────────────────────────────────
// Replace with real developer information when finalized.
export const DEV_TEAM_MEMBERS: DevTeamMember[] = [
  {
    id: 'dev-001',
    name: 'DEVELOPER NAME',
    role: 'Lead Frontend Developer',
    description: 'Architecting pixel-perfect interfaces and crafting immersive user experiences for the ELICIT platform.',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    email: 'developer@example.com',
    techStack: ['React', 'Next.js', 'TypeScript'],
    status: 'online',
    color: '#22d3ee',
    shadow: 'rgba(34, 211, 238, 0.4)',
    bg: 'rgba(34, 211, 238, 0.05)',
  },
  {
    id: 'dev-002',
    name: 'DEVELOPER NAME',
    role: 'Frontend Developer',
    description: 'Building responsive components and implementing smooth animations across the cosmic interface.',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    email: 'developer@example.com',
    techStack: ['React', 'Tailwind CSS', 'Motion'],
    status: 'online',
    color: '#a855f7',
    shadow: 'rgba(168, 85, 247, 0.4)',
    bg: 'rgba(168, 85, 247, 0.05)',
  },
  {
    id: 'dev-003',
    name: 'DEVELOPER NAME',
    role: 'Backend Developer',
    description: 'Engineering robust server-side systems and API endpoints that power the galactic infrastructure.',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    email: 'developer@example.com',
    techStack: ['Node.js', 'Python', 'MongoDB'],
    status: 'away',
    color: '#34d399',
    shadow: 'rgba(52, 211, 153, 0.4)',
    bg: 'rgba(52, 211, 153, 0.05)',
  },
  {
    id: 'dev-004',
    name: 'DEVELOPER NAME',
    role: 'Full Stack Developer',
    description: 'Bridging frontend aesthetics with backend logic to deliver seamless end-to-end features.',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    techStack: ['Next.js', 'Node.js', 'Docker'],
    status: 'online',
    color: '#facc15',
    shadow: 'rgba(250, 204, 21, 0.4)',
    bg: 'rgba(250, 204, 21, 0.05)',
  },
  {
    id: 'dev-005',
    name: 'DEVELOPER NAME',
    role: 'UI/UX Developer',
    description: 'Designing intuitive pixel-art interfaces and ensuring accessibility across all cosmic viewports.',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    email: 'developer@example.com',
    techStack: ['React', 'CSS', 'Figma'],
    status: 'offline',
    color: '#f472b6',
    shadow: 'rgba(244, 114, 182, 0.4)',
    bg: 'rgba(244, 114, 182, 0.05)',
  },
  {
    id: 'dev-006',
    name: 'DEVELOPER NAME',
    role: 'DevOps Engineer',
    description: 'Maintaining deployment pipelines and ensuring zero-downtime launches across the star system.',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    techStack: ['Docker', 'Git', 'Node.js'],
    status: 'away',
    color: '#fb923c',
    shadow: 'rgba(251, 146, 60, 0.4)',
    bg: 'rgba(251, 146, 60, 0.05)',
  },
];

// ─── TECH STACK INVENTORY ─────────────────────────────────────────────────────
export const DEV_TECH_STACK: DevTechItem[] = [
  { name: 'React', icon: '⚛️', category: 'frontend', color: '#61dafb' },
  { name: 'Next.js', icon: '▲', category: 'frontend', color: '#ffffff' },
  { name: 'TypeScript', icon: '🔷', category: 'language', color: '#3178c6' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'frontend', color: '#38bdf8' },
  { name: 'Motion', icon: '✨', category: 'frontend', color: '#f472b6' },
  { name: 'Node.js', icon: '🟢', category: 'backend', color: '#68a063' },
  { name: 'Python', icon: '🐍', category: 'language', color: '#ffd43b' },
  { name: 'MongoDB', icon: '🍃', category: 'backend', color: '#47a248' },
  { name: 'Docker', icon: '🐳', category: 'devops', color: '#2496ed' },
  { name: 'Git', icon: '📦', category: 'devops', color: '#f05032' },
];

// ─── OPTIONAL ACHIEVEMENTS ────────────────────────────────────────────────────
// This section can be removed if not needed later.
export const DEV_ACHIEVEMENTS: DevAchievement[] = [
  {
    id: 'first-commit',
    title: 'FIRST COMMIT',
    description: 'Pushed the initial codebase to the repository.',
    icon: '🚀',
    color: '#22d3ee',
  },
  {
    id: 'bug-slayer',
    title: 'BUG SLAYER',
    description: 'Squashed 50+ critical bugs before launch.',
    icon: '🐛',
    color: '#34d399',
  },
  {
    id: 'pixel-perfectionist',
    title: 'PIXEL PERFECTIONIST',
    description: 'Achieved pixel-perfect parity across all viewports.',
    icon: '🎯',
    color: '#facc15',
  },
  {
    id: 'midnight-deployer',
    title: 'MIDNIGHT DEPLOYER',
    description: 'Shipped production builds past midnight.',
    icon: '🌙',
    color: '#a855f7',
  },
  {
    id: 'code-reviewer',
    title: 'CODE REVIEWER',
    description: 'Reviewed and approved 100+ pull requests.',
    icon: '👁️',
    color: '#f472b6',
  },
  {
    id: 'speed-demon',
    title: 'SPEED DEMON',
    description: 'Optimized page load to under 2 seconds.',
    icon: '⚡',
    color: '#fb923c',
  },
];
