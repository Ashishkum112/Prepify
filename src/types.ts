export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string; // "p<pattern_idx>-q<question_idx>"
  name: string;
  difficulty: Difficulty;
  url: string;
}

export interface Pattern {
  index: number;
  name: string;
  tag: string;
  icon: string;
  description: string;
  questions: Question[];
}

export interface QuestionProgress {
  solved: boolean;
  note: string;
  solvedAt?: string;
  spacedRepetitionDate1?: string; // 1-day reminder
  spacedRepetitionDate7?: string; // 7-day reminder
  spacedRepetitionDate14?: string; // 14-day reminder
}

// Map from question ID (e.g. "p0-q5") to its progress
export interface ProgressState {
  [questionId: string]: QuestionProgress;
}

export interface StreakState {
  currentStreak: number;
  lastSolvedDate?: string;
  streakDates: string[]; // dates on which "Marked Completed" (YYYY-MM-DD)
}

export interface AppConfig {
  googleClientId: string;
  calendarAutoBlock: boolean;
  emailReminders: boolean;
  calendarTargetName: string;
  testEmail: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'calendar' | 'email' | 'system' | 'oauth';
  message: string;
}
