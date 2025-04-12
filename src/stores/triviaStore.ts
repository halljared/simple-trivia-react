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
  event: TriviaEvent | null;
  categories: TriviaCategory[];
  currentRound: TriviaRound | null; // Make currentRound nullable
  isLoading: boolean;
  events: TriviaEvent[];

  // Actions
  setEvent: (event: TriviaEvent) => void;
  loadEvents: () => TriviaEvent[];
  updateRound: (round: TriviaRound) => void;
  deleteRound: (roundId: string) => void;
  loadEvent: (eventId: string) => TriviaEvent | null;
  fetchCategories: () => Promise<void>;
  setCurrentRound: (roundId: string | null) => void; // Accepts roundId, can unset
  addRound: () => void;
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
  event: null,
  categories: [],
  currentRound: null, // Initialize as null
  isLoading: false,
  events: [],

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
    const event = get().event;
    if (event) {
      const round = event.rounds.find((r) => r.id === roundId);
      set({ currentRound: round || null }); // Set to null if not found
    } else {
      set({ currentRound: null }); // No event, so no round
    }
  },

  setEvent: (event) => {
    set({ event: event });
    let events = get().loadEvents();

    if (!events.find((e) => e.id === event.id)) {
      events.push(event);
    } else {
      events = events.map((e) => (e.id === event.id ? event : e));
    }
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem(`event-${event.id}`, JSON.stringify(event));
  },

  loadEvent: (eventId: string): TriviaEvent | null => {
    const storedEvent = localStorage.getItem(`event-${eventId}`);
    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent);
      set({ event: parsedEvent });
      return parsedEvent;
    }
    return null;
  },

  loadEvents: () => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      set({ events: parsedEvents });
      return parsedEvents;
    }
    return [];
  },

  addRound: () =>
    set((state) => {
      if (!state.event) return state;

      const newRound = {
        id: crypto.randomUUID(),
        name: 'New Round',
        questions: [],
      };

      const updatedEvent = {
        ...state.event,
        rounds: [...state.event.rounds, newRound],
      };

      localStorage.setItem(
        `event-${updatedEvent.id}`,
        JSON.stringify(updatedEvent)
      );

      return { event: updatedEvent };
    }),

  updateRound: (updatedRound) =>
    set((state) => {
      if (!state.event) return state;

      const updatedEvent = {
        ...state.event,
        rounds: state.event.rounds.map((r) =>
          r.id === updatedRound.id ? updatedRound : r
        ),
      };

      localStorage.setItem(
        `event-${updatedEvent.id}`,
        JSON.stringify(updatedEvent)
      );
      return { event: updatedEvent, currentRound: updatedRound }; // Update currentRound too!
    }),

  deleteRound: (roundId) =>
    set((state) => {
      if (!state.event) return state;

      const updatedEvent = {
        ...state.event,
        rounds: state.event.rounds.filter((r) => r.id !== roundId),
      };

      localStorage.setItem(
        `event-${updatedEvent.id}`,
        JSON.stringify(updatedEvent)
      );
      return { event: updatedEvent };
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
