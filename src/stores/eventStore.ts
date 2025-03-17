import { create } from 'zustand';
import { TriviaEvent, TriviaRound } from '../types/trivia';

interface EventStore {
  currentEvent: TriviaEvent | null;
  setEvent: (event: TriviaEvent) => void;
  updateRound: (round: TriviaRound) => void;
  deleteRound: (roundId: string) => void;
  loadEvent: (eventId: string) => TriviaEvent | null;
}

export const useEventStore = create<EventStore>((set) => ({
  currentEvent: null,
  setEvent: (event) => {
    set({ currentEvent: event });
    localStorage.setItem(`event-${event.id}`, JSON.stringify(event));
  },
  loadEvent: (eventId: string) => {
    const storedEvent = localStorage.getItem(`event-${eventId}`);
    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent);
      set({ currentEvent: parsedEvent });
      return parsedEvent;
    }
    return null;
  },
  updateRound: (updatedRound) =>
    set((state) => {
      if (!state.currentEvent) return state;

      const existingRoundIndex = state.currentEvent.rounds.findIndex(
        (r) => r.id === updatedRound.id
      );

      const updatedEvent = {
        ...state.currentEvent,
        rounds:
          existingRoundIndex === -1
            ? [...state.currentEvent.rounds, updatedRound]
            : state.currentEvent.rounds.map((r) =>
                r.id === updatedRound.id ? updatedRound : r
              ),
      };

      localStorage.setItem(
        `event-${updatedEvent.id}`,
        JSON.stringify(updatedEvent)
      );
      return { currentEvent: updatedEvent };
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
}));
