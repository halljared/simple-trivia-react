import { ReactNode, useEffect } from 'react';
import { NewTriviaEvent } from '../types/trivia';
import { EventContext } from '../contexts/EventContext';
import { useTriviaStore } from '../stores/triviaStore';
import { useParams } from '@tanstack/react-router';
interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const { event, loadEvent, setEvent } = useTriviaStore();

  const { eventId } = useParams({ strict: false });

  // Initialize event if none exists
  useEffect(() => {
    if (eventId) {
      loadEvent(eventId);
    } else {
      const newEvent: NewTriviaEvent = {
        name: '',
        date: new Date(),
        host: '',
        rounds: [],
        status: 'upcoming',
      };
      setEvent(newEvent);
    }
  }, [eventId, loadEvent, setEvent]);

  const value = {
    event,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
