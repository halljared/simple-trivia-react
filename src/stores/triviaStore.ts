// triviaStore.ts
import { create } from 'zustand';
import {
  TriviaCategory,
  TriviaEvent,
  TriviaQuestion,
  TriviaQuestionAPI,
  TriviaRound,
} from '../types/trivia';
import { API_ENDPOINTS } from '../config/api';

interface TriviaStore {
  currentEvent: TriviaEvent | null;
  categories: TriviaCategory[];
  currentRound: TriviaRound | null; // Make currentRound nullable
  isLoading: boolean;

  // Actions
  setEvent: (event: TriviaEvent) => void;
  updateRound: (round: TriviaRound) => void;
  deleteRound: (roundId: string) => void;
  loadEvent: (eventId: string) => void; // Changed return type
  fetchCategories: () => Promise<void>;
  setCurrentRound: (roundId: string | null) => void; // Accepts roundId, can unset
  addQuestions: (count: number) => Promise<void>;
  updateQuestion: (question: TriviaQuestion) => void;
  deleteQuestion: (questionId: string) => void;
  setCategoryId: (categoryId: number | undefined) => void;
  fetchQuestionsForCategory: (
    categoryId: number,
    count: number
  ) => Promise<TriviaQuestion[]>;
}

export const useTriviaStore = create<TriviaStore>((set, get) => ({
  currentEvent: null,
  categories: [],
  currentRound: null, // Initialize as null
  isLoading: false,

  fetchCategories: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.categories.active);
      const categories = await response.json();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  setCurrentRound: (roundId) => {
    const event = get().currentEvent;
    if (event) {
      const round = event.rounds.find((r) => r.id === roundId);
      set({ currentRound: round || null }); // Set to null if not found
    } else {
      set({ currentRound: null }); // No event, so no round
    }
  },

  setEvent: (event) => {
    set({ currentEvent: event });
    localStorage.setItem(`event-${event.id}`, JSON.stringify(event));
  },

  loadEvent: (eventId: string) => {
    const storedEvent = localStorage.getItem(`event-${eventId}`);
    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent);
      set({ currentEvent: parsedEvent });
      // Don't return here; let setCurrentRound handle setting the round.
    }
    // No return value needed
  },

  addRound: () =>
    set((state) => {
      if (!state.currentEvent) return state;

      const newRound = {
        id: crypto.randomUUID(),
        name: 'New Round',
        questions: [],
      };

      const updatedEvent = {
        ...state.currentEvent,
        rounds: [...state.currentEvent.rounds, newRound],
      };

      localStorage.setItem(
        `event-${updatedEvent.id}`,
        JSON.stringify(updatedEvent)
      );

      return { currentEvent: updatedEvent };
    }),

  updateRound: (updatedRound) =>
    set((state) => {
      if (!state.currentEvent) return state;

      const updatedEvent = {
        ...state.currentEvent,
        rounds: state.currentEvent.rounds.map((r) =>
          r.id === updatedRound.id ? updatedRound : r
        ),
      };

      localStorage.setItem(
        `event-${updatedEvent.id}`,
        JSON.stringify(updatedEvent)
      );
      return { currentEvent: updatedEvent, currentRound: updatedRound }; // Update currentRound too!
    }),

  deleteRound: (roundId) =>
    set((state) => {
      if (!state.currentEvent) return state;

      const updatedEvent = {
        ...state.currentEvent,
        rounds: state.currentEvent.rounds.filter((r) => r.id !== roundId),
      };

      localStorage.setItem(
        `event-${updatedEvent.id}`,
        JSON.stringify(updatedEvent)
      );
      return { currentEvent: updatedEvent };
    }),

  addQuestions: async (count) => {
    const { currentRound } = get();
    if (!currentRound?.categoryId) return;

    set({ isLoading: true });
    try {
      const apiQuestions = await get().fetchQuestionsForCategory(
        currentRound.categoryId,
        count
      );
      // Update the currentRound directly, leveraging updateRound
      get().updateRound({
        ...currentRound,
        questions: apiQuestions.map((q) => ({
          ...q,
          id: crypto.randomUUID(),
        })),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuestion: (updatedQuestion) => {
    set((state) => {
      if (!state.currentRound) return state; // Guard against no current round

      const updatedRound = {
        ...state.currentRound,
        questions: state.currentRound.questions.map((q) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        ),
      };
      // Call updateRound to keep event and currentRound in sync
      return { ...state, currentRound: updatedRound };
    });
    //After updating the round, update the event.
    const { currentRound } = get();
    if (currentRound) {
      get().updateRound(currentRound);
    }
  },

  deleteQuestion: (questionId) => {
    set((state) => {
      if (!state.currentRound) return state; // Guard clause

      const updatedRound = {
        ...state.currentRound,
        questions: state.currentRound.questions.filter(
          (q) => q.id !== questionId
        ),
      };

      //Use the update round, since it will persist changes to local storage.
      return { ...state, currentRound: updatedRound };
    });
    //After updating the round, update the event.
    const { currentRound } = get();
    if (currentRound) {
      get().updateRound(currentRound);
    }
  },

  setCategoryId: (categoryId) => {
    set((state) => {
      if (!state.currentRound) return state; //Guard
      return { currentRound: { ...state.currentRound, categoryId } };
    });
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
        answerText: q.answer,
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
