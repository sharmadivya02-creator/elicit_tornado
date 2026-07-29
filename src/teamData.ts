export interface ExecutiveMember {
  name: string;
  subTitle: string;
  color: string;
  shadow: string;
  bg: string;
  linkedin: string;
  github?: string;
  bio: string;
  avatar: string;
}

export interface ClubMember {
  name: string;
  role: string;
  color: string;
  shadow: string;
  avatar: string;
}

export const TEAM_ORBIT_LABELS = ['STRATEGY', 'TECH', 'DESIGN', 'OPS', 'MENTORSHIP', 'COMMS'];

export const EXECUTIVE_MEMBERS: ExecutiveMember[] = [
  {
    name: 'DR. PRIYANK SINGHVI',
    subTitle: 'ACM Faculty Sponsor',
    color: '#ffd700',
    shadow: 'rgba(250, 204, 21, 0.45)',
    bg: 'rgba(250, 204, 21, 0.08)',
    linkedin: 'https://linkedin.com',
    bio: 'Guiding the ACM Student Chapter through research, academia, strategy, and the calm gravity of experience.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500&h=500',
  },
  {
    name: 'SARTHAK GUPTA',
    subTitle: 'Chairperson',
    color: '#22d3ee',
    shadow: 'rgba(34, 211, 238, 0.45)',
    bg: 'rgba(34, 211, 238, 0.08)',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Directing the flagship with sharp decisions, faster pivots, and the kind of operational focus that moves galaxies.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500&h=500',
  },
  {
    name: 'ANSHIKA JAIN',
    subTitle: 'Vice Chairperson',
    color: '#f472b6',
    shadow: 'rgba(244, 114, 182, 0.45)',
    bg: 'rgba(244, 114, 182, 0.08)',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Synchronizing crews, timelines, and creative systems so every mission launches with precision.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500&h=500',
  },
  {
    name: 'DEVANSH SAXENA',
    subTitle: 'Technical Head',
    color: '#34d399',
    shadow: 'rgba(52, 211, 153, 0.45)',
    bg: 'rgba(52, 211, 153, 0.08)',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Engineering the technical core, stabilizing logic engines, and turning impossible builds into clean launches.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500&h=500',
  },
  {
    name: 'ISHAAN PANT',
    subTitle: 'Graphics Head',
    color: '#c084fc',
    shadow: 'rgba(192, 132, 252, 0.45)',
    bg: 'rgba(192, 132, 252, 0.08)',
    linkedin: 'https://linkedin.com',
    bio: 'Composing the visual universe: luminous assets, sharp identities, and screens that feel alive.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500&h=500',
  },
  {
    name: 'PRIYANSHU SHARMA',
    subTitle: 'Secretary',
    color: '#fbbf24',
    shadow: 'rgba(251, 191, 36, 0.45)',
    bg: 'rgba(251, 191, 36, 0.08)',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Keeping transmissions clean, teams aligned, and mission records ready for every high-pressure orbit.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=500&h=500',
  },
];

export const CLUB_MEMBERS: ClubMember[] = [
  {
    name: 'TEAM MEMBER 01',
    role: 'Technical Team',
    color: '#22d3ee',
    shadow: 'rgba(34, 211, 238, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=420&h=520',
  },
  {
    name: 'TEAM MEMBER 02',
    role: 'Technical Team',
    color: '#34d399',
    shadow: 'rgba(52, 211, 153, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=420&h=520',
  },
  {
    name: 'TEAM MEMBER 03',
    role: 'Design Team',
    color: '#f472b6',
    shadow: 'rgba(244, 114, 182, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=420&h=520',
  },
  {
    name: 'TEAM MEMBER 04',
    role: 'Design Team',
    color: '#c084fc',
    shadow: 'rgba(192, 132, 252, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=420&h=520',
  },
  {
    name: 'TEAM MEMBER 05',
    role: 'Operations Team',
    color: '#fbbf24',
    shadow: 'rgba(251, 191, 36, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=420&h=520',
  },
  {
    name: 'TEAM MEMBER 06',
    role: 'Operations Team',
    color: '#fb923c',
    shadow: 'rgba(251, 146, 60, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=420&h=520',
  },
  {
    name: 'TEAM MEMBER 07',
    role: 'Outreach Team',
    color: '#60a5fa',
    shadow: 'rgba(96, 165, 250, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=420&h=520',
  },
  {
    name: 'TEAM MEMBER 08',
    role: 'Outreach Team',
    color: '#a78bfa',
    shadow: 'rgba(167, 139, 250, 0.45)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=420&h=520',
  },
];
