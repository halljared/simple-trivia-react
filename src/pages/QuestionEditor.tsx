import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { TriviaRound } from '../types/trivia';
import QuestionList from '../components/QuestionList';
import { questionEditorRoute, createQuizRoute } from '../App';
import { useEventStore } from '../stores/eventStore';

export default function QuestionEditor() {
  const navigate = useNavigate();
  const { eventId, roundId } = questionEditorRoute.useParams();
  const [round, setRound] = useState<TriviaRound | null>(null);
  const { currentEvent, setEvent, updateRound } = useEventStore();

  useEffect(() => {
    // If we don't have the event in the store, get it from localStorage
    if (!currentEvent) {
      const storedEvent = localStorage.getItem(`event-${eventId}`);
      if (storedEvent) {
        const parsedEvent = JSON.parse(storedEvent);
        setEvent(parsedEvent);
      }
    }

    // Set the round from either the store or localStorage
    const event =
      currentEvent ||
      JSON.parse(localStorage.getItem(`event-${eventId}`) || '{}');
    const foundRound = event.rounds?.find((r: TriviaRound) => r.id === roundId);
    setRound(foundRound || null);
  }, [eventId, roundId, currentEvent, setEvent]);

  const handleSave = (updatedRound: TriviaRound) => {
    updateRound(updatedRound);
    navigate({ to: createQuizRoute.id });
  };

  if (!currentEvent || !round) {
    return <div>Loading...</div>;
  }

  return (
    <QuestionList
      event={currentEvent}
      round={round}
      onSave={handleSave}
      onBack={() => navigate({ to: createQuizRoute.id })}
    />
  );
}
