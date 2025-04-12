import { ReactNode, useState, useEffect } from 'react';
import { TriviaEvent } from '../types/trivia';
import { EventContext } from '../contexts/EventContext';
import { useTriviaStore } from '../stores/triviaStore';
import { useParams } from '@tanstack/react-router';
interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const [event, setEvent] = useState<TriviaEvent | null>(null);
  const { loadEvent, addRound } = useTriviaStore();

  const { eventId } = useParams({ strict: false });
  // Initialize event if none exists
  useEffect(() => {
    if (eventId) {
      setEvent(loadEvent(eventId));
    } else {
      const newEvent: TriviaEvent = {
        id: crypto.randomUUID(),
        name: '',
        date: new Date(),
        host: '',
        rounds: [],
        status: 'upcoming',
      };
      setEvent(newEvent);
    }
  }, [eventId, loadEvent]);

  const value = {
    event,
    setEvent,
    addRound,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
