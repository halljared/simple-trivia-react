export interface TriviaEvent {
  id: string;
  name: string;
  date: Date;
  host: string;
  rounds: TriviaRound[];
  status: 'upcoming' | 'in-progress' | 'completed';
  totalPoints?: number;
}

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
