
export interface Goal {
  id: string;
  title: string;
  category: 'Saúde' | 'Carreira' | 'Finanças' | 'Educação' | 'Social';
  progress: number;
  steps: GoalStep[];
  deadline: string;
  xpValue: number;
}

export interface GoalStep {
  id: string;
  description: string;
  isCompleted: boolean;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  badges: Badge[];
  rank: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  progress: number;
  total: number;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  participants: number;
  daysRemaining: number;
  rewardXP: number;
}
