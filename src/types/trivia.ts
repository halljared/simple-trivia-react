export interface NewTriviaEvent {
  name: string;
  eventDate: string;
  rounds: TriviaRound[];
  status: EventStatus;
  description?: string;
}

export interface TriviaEvent extends NewTriviaEvent {
  id: string;
  userId: string;
}

export interface NewTriviaRound {
  name: string;
  categoryId?: number;
  roundNumber: number;
  questions: TriviaQuestion[];
}

export interface TriviaRound extends NewTriviaRound {
  id: string;
  eventId: string;
  createdAt: string;
}

export interface TriviaQuestionAPI {
  question: string;
  answer: string;
  type: QuestionType;
  difficulty: number;
  options?: string[];
}

export interface TriviaQuestion {
  id: string;
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
  MULTIPLE_CHOICE = 'multiple-choice',
  TRUE_FALSE = 'true-false',
  OPEN_ENDED = 'open-ended',
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
  id: string;
  name: string;
  eventDate: string | null;
  createdAt: string;
  status: string;
  roundsCount: number;
}

export interface RoundQuestionAPI {
  roundQuestionId: string;
  roundId: string;
  questionNumber: number;
  questionId: string;
  questionType: string;
  question: string;
  answer: string;
  difficulty: number;
  categoryId: number;
  categoryName: string;
}

export interface RoundAPI {
  id: string;
  name: string;
  roundNumber: number;
  eventId: string;
  categoryId: number | null;
  createdAt: string;
  questions: RoundQuestionAPI[];
}
