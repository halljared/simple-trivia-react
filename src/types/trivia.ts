export interface NewTriviaEvent {
  name: string;
  date: Date;
  host: string;
  rounds: TriviaRound[];
  status: 'upcoming' | 'in-progress' | 'completed';
  totalPoints?: number;
}

export interface TriviaEvent extends NewTriviaEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TriviaEventUnion = NewTriviaEvent | TriviaEvent;

export interface TriviaRound {
  id: string;
  name: string;
  description?: string;
  categoryId?: number;
  questions: TriviaQuestion[];
}

export interface TriviaQuestion {
  id: string;
  questionText: string;
  answerText: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  difficulty: string;
  options?: string[];
}

export interface TriviaCategory {
  id: number;
  name: string;
  question_count: number;
}

export interface TriviaQuestionAPI {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'Multiple Choice',
  TRUE_FALSE = 'True/False',
  OPEN_ENDED = 'Open Ended',
  // Add other types as needed
}

export enum QuestionDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  // ... other question properties
}

export enum TriviaCategoryNames {
  ARTS = 'ARTS',
  ENTERTAINMENT = 'ENTERTAINMENT',
  GENERAL = 'GENERAL',
  GEOGRAPHY = 'GEOGRAPHY',
  HISTORY = 'HISTORY',
  SCIENCE = 'SCIENCE',
}
