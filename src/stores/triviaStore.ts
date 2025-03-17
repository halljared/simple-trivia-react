import { create } from 'zustand';
import {
  TriviaCategory,
  TriviaQuestion,
  TriviaQuestionAPI,
} from '../types/trivia';
import { API_ENDPOINTS } from '../config/api';

interface TriviaStore {
  categories: TriviaCategory[];
  fetchCategories: () => Promise<void>;
  fetchQuestionsForCategory: (
    categoryId: number,
    count: number
  ) => Promise<TriviaQuestion[]>;
}

export const useTriviaStore = create<TriviaStore>((set) => ({
  categories: [],

  fetchCategories: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.categories.active);
      const categories = await response.json();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchQuestionsForCategory: async (categoryId: number, count: number) => {
    try {
      const response = await fetch(
        API_ENDPOINTS.questions.byCategory(categoryId, count)
      );
      const questions: TriviaQuestionAPI[] = await response.json();
      return questions.map((q) => ({
        id: crypto.randomUUID(),
        questionText: q.question,
        answerText: '', // This will be filled when we get the answer from check-answer endpoint
        type: 'open-ended',
        points: 1,
        difficulty: q.difficulty,
      }));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      return [];
    }
  },
}));
