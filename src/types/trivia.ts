export interface NewTriviaEvent {
  name: string;
  eventDate: Date;
  rounds: TriviaRound[];
  status: EventStatus;
  description?: string;
}

export interface TriviaEvent extends NewTriviaEvent {
  id: number;
  userId: number;
}

export interface NewTriviaRound {
  name: string;
  categoryId?: number;
  roundNumber: number;
  questions: TriviaQuestion[];
}

export interface TriviaRound extends NewTriviaRound {
  id: number;
  eventId: number;
  createdAt: Date;
}

export interface TriviaQuestionAPI {
  id: number;
  question: string;
  answer: string;
  type: QuestionType;
  difficulty: number;
  options?: string[];
}

export interface TriviaQuestion {
  id: number;
  questionText: string;
  answerText: string;
  type: QuestionType;
  difficulty: number;
  options?: string[];
}

export interface TriviaCategory {
  id: number;
  name: string;
  questionCount: number;
}

export enum QuestionType {
  PRESET = 'preset',
  USER = 'user',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum EventStatus {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export enum TriviaCategoryNames {
  ARTS = 'ARTS',
  ENTERTAINMENT = 'ENTERTAINMENT',
  GENERAL = 'GENERAL',
  GEOGRAPHY = 'GEOGRAPHY',
  HISTORY = 'HISTORY',
  SCIENCE = 'SCIENCE',
}

export interface ListEvent {
  id: number;
  name: string;
  eventDate: Date | null;
  createdAt: Date;
  status: string;
  roundsCount: number;
}

export interface RoundQuestionAPI {
  roundQuestionId: number;
  roundId: number;
  questionNumber: number;
  questionId: number;
  questionType: QuestionType;
  question: string;
  answer: string;
  difficulty: number;
  categoryId: number;
  categoryName: string;
}

export interface RoundAPI {
  id: number;
  name: string;
  roundNumber: number;
  eventId: number;
  categoryId: number | null;
  createdAt: string;
  questions: RoundQuestionAPI[];
}
