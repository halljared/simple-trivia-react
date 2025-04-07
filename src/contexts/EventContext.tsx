import { createContext, useContext } from 'react';
import { TriviaEvent } from '../types/trivia';

interface EventContextValue {
  currentEvent: TriviaEvent | null;
  setCurrentEvent: (event: TriviaEvent | null) => void;
}

export const EventContext = createContext<EventContextValue | undefined>(
  undefined
);

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
