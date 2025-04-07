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
  const { setEvent: saveEvent, loadEvent } = useTriviaStore();

  const { eventId } = useParams({ strict: false });
  // Initialize event if none exists
  useEffect(() => {
    if (eventId) {
      loadEvent(eventId);
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
  }, [loadEvent, eventId]);

  const _saveEvent = (event: TriviaEvent) => {
    setEvent(event);
    saveEvent(event);
  };

  const value = {
    event,
    setEvent: setEvent,
    saveEvent: _saveEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
