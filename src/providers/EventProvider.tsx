import { ReactNode, useEffect } from 'react';
import { EventContext } from '../contexts/EventContext';
import { useTriviaStore } from '../stores/triviaStore';
import { useParams } from '@tanstack/react-router';
interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const { event, loadEvent } = useTriviaStore();

  const { eventId } = useParams({ strict: false });

  // Initialize event if none exists
  useEffect(() => {
    if (eventId) {
      loadEvent(Number(eventId));
    }
  }, [eventId, loadEvent]);

  const value = {
    event,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
