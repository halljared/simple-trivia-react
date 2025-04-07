import { ReactNode, useState, useEffect } from 'react';
import { TriviaEvent } from '../types/trivia';
import { EventContext } from '../contexts/EventContext';

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const [currentEvent, setCurrentEvent] = useState<TriviaEvent | null>(null);

  // Initialize event if none exists
  useEffect(() => {
    if (!currentEvent) {
      const newEvent: TriviaEvent = {
        id: crypto.randomUUID(),
        name: '',
        date: new Date(),
        host: '',
        rounds: [],
        status: 'upcoming',
      };
      setCurrentEvent(newEvent);
    }
  }, [currentEvent]);

  const value = {
    currentEvent,
    setCurrentEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
