export type UserRole = 'WORKER' | 'ESTABLISHMENT' | 'ADMIN';

export interface GamificationProfile {
  points: number;
  level: number;
  currentStreak: number;
  badges: string[]; // Badge IDs
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  rating: number; // 0-5
  balance: number;
  location?: string;
  skills?: string[];
  cpfOrCnpj?: string;
  gamification?: GamificationProfile;
}

export type JobStatus = 'OPEN' | 'FILLED' | 'COMPLETED' | 'CANCELLED';

export interface Job {
  id: string;
  establishmentId: string;
  establishmentName: string;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  date: string; // ISO Date
  startTime: string;
  endTime: string;
  price: number; // Valor total ou hora
  skillsRequired: string[];
  status: JobStatus;
  applicantsCount: number;
}

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  jobId: string;
  score: number;
  comment: string;
}

export interface PrizeRequirements {
    minLevel?: number;
    requiredBadge?: string;
}

export interface Prize {
    id: string;
    title: string;
    description: string;
    image?: string;
    winnerId?: string; // If null, not drawn yet
    winnerName?: string;
    drawDate?: string;
    requirements?: PrizeRequirements;
}

export interface Message {
    id: string;
    applicationId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
}

export const BADGES_LIST = [
    { id: 'FIRST_JOB', label: 'Primeiro Job', icon: '🥇' },
    { id: 'FIVE_STARS', label: '5 Estrelas', icon: '⭐' },
    { id: 'STREAK_7', label: 'Semana Impecável', icon: '🔥' },
    { id: 'EARLY_BIRD', label: 'Madrugador', icon: '🌅' },
    { id: 'NIGHT_OWL', label: 'Coruja', icon: '🦉' },
    { id: 'RELIABLE', label: 'Confiável', icon: '🛡️' },
    { id: 'MASTER_CHEF', label: 'Mestre Cuca', icon: '👨‍🍳' },
    { id: 'EVENT_PRO', label: 'Pro de Eventos', icon: '🎉' },
];