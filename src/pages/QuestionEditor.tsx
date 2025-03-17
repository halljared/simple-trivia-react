import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { TriviaEvent, TriviaRound } from '../types/trivia';
import QuestionList from '../components/QuestionList';
import { questionEditorRoute, createQuizRoute } from '../App';

export default function QuestionEditor() {
  const navigate = useNavigate();
  const { eventId, roundId } = questionEditorRoute.useParams();
  const [event, setEvent] = useState<TriviaEvent | null>(null);
  const [round, setRound] = useState<TriviaRound | null>(null);

  // TODO: Replace with actual API call
  useEffect(() => {
    // For now, get from localStorage
    const storedEvent = localStorage.getItem(`event-${eventId}`);
    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent);
      setEvent(parsedEvent);
      const foundRound = parsedEvent.rounds.find(
        (r: TriviaRound) => r.id === roundId
      );
      setRound(foundRound || null);
    }
  }, [eventId, roundId]);

  const handleSave = (updatedRound: TriviaRound) => {
    if (!event) return;

    const updatedEvent = {
      ...event,
      rounds: event.rounds.map((r) =>
        r.id === updatedRound.id ? updatedRound : r
      ),
    };

    // TODO: Replace with actual API call
    localStorage.setItem(`event-${eventId}`, JSON.stringify(updatedEvent));
    setEvent(updatedEvent);
    navigate({ to: createQuizRoute.path });
  };

  if (!event || !round) {
    return <div>Loading...</div>;
  }

  return (
    <QuestionList
      event={event}
      round={round}
      onSave={handleSave}
      onBack={() => navigate({ to: createQuizRoute.path })}
    />
  );
}
