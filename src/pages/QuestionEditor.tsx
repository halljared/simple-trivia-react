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
  const { currentEvent, updateRound, loadEvent } = useEventStore();

  useEffect(() => {
    // If we don't have the event in the store, get it from localStorage
    if (!currentEvent) {
      loadEvent(eventId);
    }

    // Set the round from the store
    const event = currentEvent;
    const foundRound = event?.rounds?.find(
      (r: TriviaRound) => r.id === roundId
    );
    setRound(foundRound || null);
  }, [eventId, roundId, currentEvent, loadEvent]);

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
