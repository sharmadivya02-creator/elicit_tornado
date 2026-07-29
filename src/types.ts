export type ActiveTab = 'home' | 'about' | 'events' | 'gallery' | 'sponsors' | 'contact' | 'team' | 'dev-team';

export interface ExplorerState {
  level: number;
  xp: number;
  coins: number;
  completedMissions: string[];
  unlockedMemories: string[];
  registeredEvents: string[];
  achievements: string[];
  quizCompleted: boolean;
  quizScore: number;
  soundEnabled: boolean;
  bgMusicEnabled: boolean;
  astronautType?: 'commander' | 'coder' | 'designer' | 'pioneer' | 'navigator';
  visorColor?: string;
  badgeIcon?: 'star' | 'rocket' | 'atom' | 'shield';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  targetTab: ActiveTab;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'hackathon' | 'workshop' | 'competition';
  date: string;
  difficulty: number; // 1-5
  description: string;
  reward: string;
  tags: string[];
}

export interface GalleryAlbum {
  id: string;
  title: string;
  count: number;
  category: 'hackathon' | 'workshop' | 'competition' | 'cultural' | 'bts';
  x: number; // custom mapping coordinate for space layout
  y: number;
  description: string;
  images: string[];
}

export interface Sponsor {
  id: string;
  name: string;
  category: 'supernova' | 'nebula' | 'asteroid';
  logoUrl?: string;
  description: string;
  website: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  icon: string;
  condition: string;
}
