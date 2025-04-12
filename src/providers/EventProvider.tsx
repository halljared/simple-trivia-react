import { ReactNode, useState, useEffect } from 'react';
import { NewTriviaEvent, TriviaEventUnion } from '../types/trivia';
import { EventContext } from '../contexts/EventContext';
import { useTriviaStore } from '../stores/triviaStore';
import { useParams } from '@tanstack/react-router';
interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const [event, setEvent] = useState<TriviaEventUnion | null>(null);
  const { loadEvent } = useTriviaStore();

  const { eventId } = useParams({ strict: false });
  // Initialize event if none exists
  useEffect(() => {
    if (eventId) {
      setEvent(loadEvent(eventId));
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
  }, [eventId, loadEvent]);

  const addRound = () => {
    setEvent((prevEvent) => {
      if (prevEvent) {
        const newRound = {
          id: crypto.randomUUID(),
          name: 'New Round',
          questions: [],
        };
        return {
          ...prevEvent,
          rounds: [...prevEvent.rounds, newRound],
        };
      }
      return prevEvent;
    });
  };

  const value = {
    event,
    setEvent,
    addRound,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
