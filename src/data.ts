import { Mission, EventItem, GalleryAlbum, Sponsor, Achievement } from './types';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'base-mission',
    title: 'Visit Galactic Base',
    description: 'Explore the "About Us" coordinates to learn about ACM MUJ.',
    rewardCoins: 100,
    rewardXp: 150,
    targetTab: 'about'
  },
  {
    id: 'event-mission',
    title: 'Analyze Event Space',
    description: 'Examine the upcoming missions & workshops in the "Events" grid.',
    rewardCoins: 100,
    rewardXp: 150,
    targetTab: 'events'
  },
  {
    id: 'gallery-mission',
    title: 'Unlock 5 Memories',
    description: 'Browse the star clusters in the "Gallery" and open 5 memories.',
    rewardCoins: 150,
    rewardXp: 200,
    targetTab: 'gallery'
  },
  {
    id: 'sponsor-mission',
    title: 'Cosmic Partnerships',
    description: 'Meet the interstellar sponsors funding our warp drive.',
    rewardCoins: 100,
    rewardXp: 100,
    targetTab: 'sponsors'
  },
  {
    id: 'comms-mission',
    title: 'Establish Comms Link',
    description: 'Send a transmission subwave using the "Contact" terminal.',
    rewardCoins: 150,
    rewardXp: 150,
    targetTab: 'contact'
  },
  {
    id: 'hackathon-mission',
    title: 'Warp to Hackathon',
    description: 'Register your explorer team for Cosmic Hack 2.0.',
    rewardCoins: 200,
    rewardXp: 250,
    targetTab: 'events'
  },
  {
    id: 'quiz-mission',
    title: 'Quiz Nexus Challenge',
    description: 'Complete the Quiz Nexus test and prove your space knowledge.',
    rewardCoins: 200,
    rewardXp: 250,
    targetTab: 'events'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'cosmic-hack',
    title: 'COSMIC HACK 2.0',
    category: 'hackathon',
    date: '24 - 25 OCT 2026',
    difficulty: 4,
    description: 'The ultimate 36-hour interstellar hackathon! Build innovative gravity-defying solutions under extreme planetary conditions. Network with elite galaxy mentors and win warp-drive level prizes.',
    reward: '500 Star Coins & Rare Neon Badge',
    tags: ['Web3', 'AI/ML', 'Hardware', 'Gaming']
  },
  {
    id: 'ai-odyssey',
    title: 'AI ODYSSEY',
    category: 'workshop',
    date: '18 OCT 2026',
    difficulty: 3,
    description: 'Deep dive into cosmic intelligence engines and deep neural nebulae. Learn how to train Large Language Models to map unknown galaxies, navigate asteroid fields, and auto-summarize starfleet logs.',
    reward: '200 Star Coins & Neural Circuitry',
    tags: ['Generative AI', 'Python', 'PyTorch']
  },
  {
    id: 'robotics-arena',
    title: 'ROBOTICS ARENA',
    category: 'competition',
    date: '21 OCT 2026',
    difficulty: 4,
    description: 'Deploy your autonomous rovers on a miniature simulated Martian crust. Program them to collect core samples, dodge cosmic sandstorms, and deposit resources inside the ACM lander hatch.',
    reward: '400 Star Coins & Robot Commander Title',
    tags: ['ROS', 'Microcontrollers', 'C++', 'Control Systems']
  },
  {
    id: 'design-sprint',
    title: 'DESIGN SPRINT',
    category: 'workshop',
    date: '20 OCT 2026',
    difficulty: 3,
    description: 'Learn retro UI layouts, cosmic responsive alignment, and high-fidelity wireframing for intergalactic starship dashboards. Perfect your pixel art and create intuitive zero-gravity controls.',
    reward: '150 Star Coins & Holo-Figma License',
    tags: ['Figma', 'UI/UX', 'Pixel Art', 'Prototyping']
  },
  {
    id: 'quiz-nexus',
    title: 'QUIZ NEXUS',
    category: 'competition',
    date: '22 OCT 2026',
    difficulty: 3,
    description: 'Unleash your mental processors in a speed trivia competition. Questions span computer science lore, internet network layers, deep space physics, and the legendary history of ACM student chapters.',
    reward: '250 Star Coins & Einstein Brain Upgrade',
    tags: ['Trivia', 'Algorithms', 'Cosmology', 'Speed-Run']
  },
  {
    id: 'ace-the-code',
    title: 'ACE THE CODE',
    category: 'competition',
    date: '22 OCT 2026',
    difficulty: 4,
    description: 'Race against time and other competitive programmers to compile highly-optimized algorithms. Write clean code that runs in O(1) space complexity to escape incoming black hole event horizons.',
    reward: '350 Star Coins & Golden Compiler Crown',
    tags: ['Data Structures', 'Algorithms', 'Competitive Programming']
  }
];

export const INITIAL_GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: 'elicit-24',
    title: "ELICIT'24",
    count: 32,
    category: 'hackathon',
    x: 68,
    y: 22,
    description: 'Highlights from the monumental ELICIT 2024 tech fest, featuring 500+ participants.',
    images: [
      'https://picsum.photos/seed/elicit1/800/600',
      'https://picsum.photos/seed/elicit2/800/600',
      'https://picsum.photos/seed/elicit3/800/600',
      'https://picsum.photos/seed/elicit4/800/600',
      'https://picsum.photos/seed/elicit5/800/600',
      'https://picsum.photos/seed/elicit6/800/600'
    ]
  },
  {
    id: 'elicit-23',
    title: "ELICIT'23",
    count: 28,
    category: 'competition',
    x: 35,
    y: 42,
    description: 'Relive the adrenaline from the previous year’s epic hackathon sprints and award ceremony.',
    images: [
      'https://picsum.photos/seed/space1/800/600',
      'https://picsum.photos/seed/space2/800/600',
      'https://picsum.photos/seed/space3/800/600',
      'https://picsum.photos/seed/space4/800/600',
      'https://picsum.photos/seed/space5/800/600'
    ]
  },
  {
    id: 'workshops',
    title: 'WORKSHOPS',
    count: 18,
    category: 'workshop',
    x: 80,
    y: 48,
    description: 'Explorers sharpening their development, artificial intelligence, and physical computing skills.',
    images: [
      'https://picsum.photos/seed/work1/800/600',
      'https://picsum.photos/seed/work2/800/600',
      'https://picsum.photos/seed/work3/800/600',
      'https://picsum.photos/seed/work4/800/600'
    ]
  },
  {
    id: 'competitions',
    title: 'COMPETITIONS',
    count: 22,
    category: 'competition',
    x: 52,
    y: 68,
    description: 'High-stakes robotics brawls, competitive programming tournaments, and design shootouts.',
    images: [
      'https://picsum.photos/seed/comp1/800/600',
      'https://picsum.photos/seed/comp2/800/600',
      'https://picsum.photos/seed/comp3/800/600',
      'https://picsum.photos/seed/comp4/800/600',
      'https://picsum.photos/seed/comp5/800/600'
    ]
  },
  {
    id: 'bts',
    title: 'BEHIND THE SCENES',
    count: 12,
    category: 'bts',
    x: 75,
    y: 84,
    description: 'The tireless core committee and student volunteers planning, coding, and building the universe.',
    images: [
      'https://picsum.photos/seed/team1/800/600',
      'https://picsum.photos/seed/team2/800/600',
      'https://picsum.photos/seed/team3/800/600',
      'https://picsum.photos/seed/team4/800/600'
    ]
  }
];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'google',
    name: 'Google Cloud',
    category: 'supernova',
    description: 'Powering deep space data compute and massive serverless infrastructure for elite galactic applications.',
    website: 'https://cloud.google.com'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'supernova',
    description: 'The central storage core of starfleet commands, hosting collaborative code repositories for billions of developers.',
    website: 'https://github.com'
  },
  {
    id: 'muj',
    name: 'Manipal University Jaipur',
    category: 'supernova',
    description: 'Our galactic base academy, nurturing a thriving community of engineers, astronomers, and software wizards.',
    website: 'https://jaipur.manipal.edu'
  },
  {
    id: 'devfolio',
    name: 'Devfolio',
    category: 'nebula',
    description: 'Providing seamless hacker matchmaking, team formation engines, and global launch portals for creative dev missions.',
    website: 'https://devfolio.co'
  },
  {
    id: 'polygon',
    name: 'Polygon Labs',
    category: 'nebula',
    description: 'Scaling decentralized consensus systems with ultra-fast layer-2 transaction thrusters.',
    website: 'https://polygon.technology'
  },
  {
    id: 'replit',
    name: 'Replit',
    category: 'nebula',
    description: 'Immediate browser-based compilation chambers, allowing scouts to prototype code on tiny portable communicators.',
    website: 'https://replit.com'
  },
  {
    id: 'redbull',
    name: 'Red Bull',
    category: 'asteroid',
    description: 'Vital carbonated core fuel supplying critical mental acceleration during late-night refuel cycles.',
    website: 'https://redbull.com'
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'asteroid',
    description: 'The universe’s premier collaborative design portal for sketching spaceship interfaces and layouts.',
    website: 'https://figma.com'
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'asteroid',
    description: 'Low-latency subspace voice and text matrix connecting interstellar scouts and teams.',
    website: 'https://discord.gg'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Visited 3 planetary coordinates',
    rewardCoins: 100,
    icon: '🚀',
    condition: 'Visits 3 tabs'
  },
  {
    id: 'star-collector',
    title: 'Star Collector',
    description: 'Amassed 1,500 Star Coins',
    rewardCoins: 200,
    icon: '⭐',
    condition: 'Coins >= 1500'
  },
  {
    id: 'event-explorer',
    title: 'Event Explorer',
    description: 'Registered for Cosmic Hack 2.0',
    rewardCoins: 150,
    icon: '🏆',
    condition: 'Registers for cosmic hack'
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Completed the Quiz Nexus perfect score',
    rewardCoins: 150,
    icon: '🧠',
    condition: 'Quiz score 3/3'
  },
  {
    id: 'comms-officer',
    title: 'Comms Officer',
    description: 'Sent deep space comms wave',
    rewardCoins: 100,
    icon: '📡',
    condition: 'Submit contact form'
  },
  {
    id: 'master-explorer',
    title: 'Galaxy Legend',
    description: 'Completed all 7 galactic missions',
    rewardCoins: 300,
    icon: '👑',
    condition: 'All 7 missions completed'
  }
];
