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
    questions: TriviaQuestion[];
    category?: string[];
    roundNumber: number;
    timeLimit?: number; // in minutes
}

export interface TriviaQuestion {
    id: string;
    questionText: string;
    answerText: string;
    points: number;
    type: 'multiple-choice' | 'true-false' | 'open-ended';
    options?: string[]; // for multiple choice questions
    difficulty: 'easy' | 'medium' | 'hard';
}
