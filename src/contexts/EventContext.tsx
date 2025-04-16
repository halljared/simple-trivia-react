import { createContext, useContext } from 'react';
import { TriviaEventUnion } from '../types/trivia';

interface EventContextValue {
  event: TriviaEventUnion | null;
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
