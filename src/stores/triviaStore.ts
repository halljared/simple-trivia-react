// triviaStore.ts
import { create } from 'zustand';
import {
  TriviaCategory,
  TriviaEvent,
  TriviaQuestion,
  TriviaQuestionAPI,
  TriviaRound,
  TriviaEventUnion,
  ListEvent,
} from '../types/trivia';
import { API_ENDPOINTS } from '../config/api';
import { useAuthStore } from './userStore';

interface TriviaStore {
  event: TriviaEvent | null;
  categories: TriviaCategory[];
  currentRound: TriviaRound | null; // Make currentRound nullable
  isLoading: boolean;
  isLoadingEvent: boolean;
  isDeletingEvent: boolean; // Add loading state for deletion
  isLoadingEvents: boolean; // Add loading state for events list
  events: ListEvent[];

  // Actions
  saveEvent: (event: TriviaEventUnion) => void;
  loadEvents: () => Promise<void>;
  updateRound: (round: TriviaRound) => void;
  deleteRound: (roundId: string) => void;
  loadEvent: (eventId: string) => Promise<TriviaEvent | null>;
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
  deleteEvent: (eventId: string) => Promise<void>; // Add delete event function
}

export const useTriviaStore = create<TriviaStore>((set, get) => ({
  event: null,
  categories: [],
  currentRound: null, // Initialize as null
  isLoading: false,
  isLoadingEvent: false,
  isDeletingEvent: false, // Initialize deletion loading state
  isLoadingEvents: false, // Initialize loading state
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

  saveEvent: async (event) => {
    set({ isLoadingEvent: true });
    try {
      const response = await fetch(API_ENDPOINTS.events.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
        },
        body: JSON.stringify({
          id: 'id' in event ? event.id : undefined,
          name: event.name,
          event_date: event.date,
          description: event.description ?? '', // Use nullish coalescing to handle undefined
          status: event.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      const savedEvent = await response.json();
      set({ event: savedEvent, isLoadingEvent: false });
      return savedEvent; // Optionally return the saved event if needed
    } catch (error) {
      console.error('Error saving event:', error);
      set({ isLoadingEvent: false });
      throw error;
    }
  },

  loadEvent: async (eventId: string): Promise<TriviaEvent | null> => {
    set({ isLoadingEvent: true });
    try {
      const response = await fetch(API_ENDPOINTS.events.get(eventId), {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const event = await response.json();
      set({ event, isLoadingEvent: false });
      return event;
    } catch (error) {
      console.error('Error loading event:', error);
      set({ isLoadingEvent: false });
      return null;
    }
  },

  loadEvents: async () => {
    set({ isLoadingEvents: true });
    try {
      const response = await fetch(API_ENDPOINTS.events.my, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const events: ListEvent[] = await response.json();
      set({ events, isLoadingEvents: false });
    } catch (error) {
      console.error('Error loading events:', error);
      set({ events: [], isLoadingEvents: false });
    }
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

  deleteEvent: async (eventId: string) => {
    set({ isDeletingEvent: true });
    try {
      const response = await fetch(API_ENDPOINTS.events.get(eventId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove the event from the local events list
      set((state) => ({
        events: state.events.filter((e) => e.id !== eventId),
        isDeletingEvent: false,
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      set({ isDeletingEvent: false });
      throw error;
    }
  },
}));
