import { create } from 'zustand';
import {
  TriviaCategory,
  TriviaQuestion,
  TriviaQuestionAPI,
  TriviaEvent,
  NewTriviaEvent,
  ListEvent,
  RoundAPI,
  TriviaRound,
} from '../types/trivia';
import { API_ENDPOINTS } from '../config/api';
import { useAuthStore } from './userStore';
import { mapQuestionType } from '../util/helpers';

interface TriviaStore {
  event: TriviaEvent | null;
  categories: TriviaCategory[];
  currentRound: TriviaRound | null;
  isLoading: boolean;
  isLoadingEvent: boolean;
  isDeletingEvent: boolean;
  isDeletingRound: boolean;
  isLoadingEvents: boolean;
  isLoadingRound: boolean;
  events: ListEvent[];

  setEvent: (event: TriviaEvent) => void;
  saveEvent: (event: TriviaEvent | NewTriviaEvent) => void;
  loadEvents: () => Promise<void>;
  updateRound: (round: TriviaRound) => void;
  deleteRound: (roundId: number) => void;
  loadEvent: (eventId: number) => Promise<TriviaEvent | null>;
  fetchCategories: () => Promise<void>;
  setCurrentRound: (roundId: number | null) => void;
  addRound: () => Promise<TriviaRound>;
  addQuestions: (count: number) => Promise<void>;
  updateQuestion: (question: TriviaQuestion) => void;
  deleteQuestion: (questionId: number) => void;
  setCategoryId: (categoryId: number | undefined) => void;
  fetchQuestionsForCategory: (
    categoryId: number,
    count: number
  ) => Promise<TriviaQuestion[]>;
  deleteEvent: (eventId: number) => Promise<void>;
  loadRound: (roundId: number) => Promise<TriviaRound | null>;
}

export const useTriviaStore = create<TriviaStore>((set, get) => ({
  event: null,
  categories: [],
  currentRound: null,
  isLoading: false,
  isLoadingEvent: false,
  isDeletingEvent: false,
  isDeletingRound: false,
  isLoadingEvents: false,
  isLoadingRound: false,
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

  setEvent: (event: TriviaEvent) => {
    set({ event });
  },

  setCurrentRound: (roundId) => {
    const event = get().event;
    if (event) {
      const round = event.rounds.find((r) => r.id === roundId);
      set({ currentRound: round || null });
    } else {
      set({ currentRound: null });
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
          eventDate: event.eventDate,
          description: event.description ?? '',
          status: event.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      const savedEvent = await response.json();
      const merged = { ...event, ...savedEvent };
      set({ event: merged, isLoadingEvent: false });
      return merged;
    } catch (error) {
      console.error('Error saving event:', error);
      set({ isLoadingEvent: false });
      throw error;
    }
  },

  loadEvent: async (eventId: number): Promise<TriviaEvent | null> => {
    set({ isLoadingEvent: true });

    // Create the promise and store it in the state
    const promise = fetch(API_ENDPOINTS.events.get(eventId), {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        return response.json();
      })
      .then((event) => {
        // Ensure rounds is always an array
        const normalizedEvent = { ...event, rounds: event.rounds || [] };
        set({ event: normalizedEvent, isLoadingEvent: false });
        return normalizedEvent;
      })
      .catch((error) => {
        console.error('Error loading event:', error);
        set({ isLoadingEvent: false });
        return null;
      });

    // Return the promise for external usage
    return promise;
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

  addRound: async (): Promise<TriviaRound> => {
    const { event } = get();

    if (!event) {
      return Promise.reject(new Error('No event found'));
    }

    if (!('id' in event)) {
      return Promise.reject(new Error('Event does not have an ID'));
    }

    const response = await fetch(API_ENDPOINTS.rounds.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
      },
      body: JSON.stringify({
        event_id: event.id,
      }),
    });

    if (!response.ok) {
      return Promise.reject(new Error('Failed to create round'));
    }

    const newRound = await response.json();

    set((state) => {
      if (!state.event) return state;
      return {
        event: {
          ...state.event,
          rounds: [...state.event.rounds, newRound],
        },
      };
    });

    return newRound;
  },

  updateRound: (updatedRound: TriviaRound) =>
    set((state) => {
      if (!state.event) return state;

      const updatedEvent = {
        ...state.event,
        rounds: state.event.rounds.map((r) =>
          r.id === updatedRound.id ? updatedRound : r
        ),
      };

      return { event: updatedEvent, currentRound: updatedRound };
    }),

  deleteRound: async (roundId: number) => {
    set({ isDeletingRound: true });
    try {
      const response = await fetch(API_ENDPOINTS.rounds.get(roundId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete round');
      }

      set((state) => {
        if (!state.event) return state;
        return {
          event: {
            ...state.event,
            rounds: state.event.rounds.filter((r) => r.id !== roundId),
          },
          isDeletingRound: false,
        };
      });
    } catch (error) {
      console.error('Error deleting round:', error);
      set({ isDeletingRound: false });
      throw error;
    }
  },

  loadRound: async (roundId: number): Promise<TriviaRound | null> => {
    const { event } = get();
    if (!event) {
      return Promise.reject(new Error('No event found'));
    }
    set({ isLoadingRound: true });
    try {
      const response = await fetch(API_ENDPOINTS.rounds.get(roundId), {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch round');
      }

      const roundData: RoundAPI = await response.json();

      const questions: TriviaQuestion[] = roundData.questions.map((q) => {
        return {
          id: q.questionId,
          question: q.question,
          answer: q.answer,
          type: mapQuestionType(q.questionType),
          difficulty: q.difficulty,
        };
      });

      const round: TriviaRound = {
        id: roundData.id,
        eventId: roundData.eventId,
        name: roundData.name,
        roundNumber: roundData.roundNumber,
        categoryId: roundData.categoryId ?? undefined,
        questions,
        createdAt: new Date(roundData.createdAt),
      };

      set((state) => {
        const currentEvent = state.event;
        if (!currentEvent)
          throw new Error(
            'No event found. To load a round an event is required.'
          );

        const updatedRounds = currentEvent.rounds.some((r) => r.id === round.id)
          ? currentEvent.rounds.map((r) => (r.id === round.id ? round : r))
          : [...currentEvent.rounds, round];

        return {
          event: { ...currentEvent, rounds: updatedRounds },
          currentRound: round,
          isLoadingRound: false,
        };
      });

      return round;
    } catch (error) {
      console.error('Error loading round:', error);
      set({ isLoadingRound: false });
      return null;
    }
  },

  addQuestions: async (count) => {
    const { currentRound } = get();
    if (!currentRound?.categoryId) return;

    set({ isLoading: true });
    try {
      const apiQuestions = await get().fetchQuestionsForCategory(
        currentRound.categoryId,
        count
      );
      get().updateRound({
        ...currentRound,
        questions: apiQuestions.map((q) => ({
          ...q,
          id: q.id,
        })),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuestion: (updatedQuestion) => {
    set((state) => {
      if (!state.currentRound) return state;

      const updatedRound = {
        ...state.currentRound,
        questions: state.currentRound.questions.map((q) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        ),
      };
      return { ...state, currentRound: updatedRound };
    });
    const { currentRound } = get();
    if (currentRound) {
      get().updateRound(currentRound);
    }
  },

  deleteQuestion: (questionId) => {
    set((state) => {
      if (!state.currentRound) return state;

      const updatedRound = {
        ...state.currentRound,
        questions: state.currentRound.questions.filter(
          (q) => q.id !== questionId
        ),
      };
      return { ...state, currentRound: updatedRound };
    });
    const { currentRound } = get();
    if (currentRound) {
      get().updateRound(currentRound);
    }
  },

  setCategoryId: (categoryId) => {
    set((state) => {
      if (!state.currentRound) return state;
      return { currentRound: { ...state.currentRound, categoryId } };
    });
  },

  fetchQuestionsForCategory: async (
    categoryId: number,
    count: number
  ): Promise<TriviaQuestion[]> => {
    try {
      const response = await fetch(
        API_ENDPOINTS.questions.byCategory(categoryId, count)
      );
      const questionsAPI: TriviaQuestionAPI[] = await response.json();

      return questionsAPI.map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        type: mapQuestionType(q.type),
        difficulty: q.difficulty,
        options: q.options,
      }));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      return [];
    }
  },

  deleteEvent: async (eventId: number) => {
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
