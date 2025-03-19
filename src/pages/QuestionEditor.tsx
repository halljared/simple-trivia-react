import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { TriviaRound } from '../types/trivia';
import QuestionList from '../components/QuestionList';
import { questionEditorRoute, createQuizRoute } from '../App';
import { useEventStore } from '../stores/eventStore';
import { useCategories } from '../hooks/useCategories';
import { useQuestionOperations } from '../hooks/useQuestionOperations';

export default function QuestionEditor() {
  const navigate = useNavigate();
  const { eventId, roundId } = questionEditorRoute.useParams();
  const { currentEvent, updateRound, loadEvent } = useEventStore();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  useEffect(() => {
    // If we don't have the event in the store, get it from localStorage
    if (!currentEvent) {
      loadEvent(eventId);
    }
  }, [eventId, currentEvent, loadEvent]);

  // Find the round from the store
  const round = currentEvent?.rounds?.find(
    (r: TriviaRound) => r.id === roundId
  );

  const {
    editedRound,
    isLoading: isLoadingQuestions,
    handleAddQuestions,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleCategoryChange,
  } = useQuestionOperations(round || { id: '', name: '', questions: [] });

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
      round={editedRound}
      categories={categories}
      onSave={() => handleSave(editedRound)}
      onBack={() => navigate({ to: createQuizRoute.id })}
      onUpdateQuestion={handleUpdateQuestion}
      onDeleteQuestion={handleDeleteQuestion}
      onAddQuestions={handleAddQuestions}
      onCategoryChange={handleCategoryChange}
      isLoading={isLoadingQuestions}
      isLoadingCategories={isLoadingCategories}
    />
  );
}
