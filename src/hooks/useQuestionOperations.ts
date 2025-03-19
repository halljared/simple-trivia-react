import { useState } from 'react';
import { TriviaRound, TriviaQuestion } from '../types/trivia';
import { useTriviaStore } from '../stores/triviaStore';

export function useQuestionOperations(round: TriviaRound) {
  const [editedRound, setEditedRound] = useState<TriviaRound>(round);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchQuestionsForCategory } = useTriviaStore();

  const handleAddQuestions = async (count: number) => {
    if (!editedRound.categoryId) return;
    setIsLoading(true);
    try {
      const apiQuestions = await fetchQuestionsForCategory(
        editedRound.categoryId,
        count
      );
      setEditedRound((prev) => ({
        ...prev,
        questions: prev.questions.concat(
          apiQuestions.map((q) => ({
            ...q,
            id: crypto.randomUUID(),
          }))
        ),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuestion = (updatedQuestion: TriviaQuestion) => {
    setEditedRound((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setEditedRound((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setEditedRound((prev) => ({
      ...prev,
      categoryId,
    }));
  };

  return {
    editedRound,
    isLoading,
    handleAddQuestions,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleCategoryChange,
  };
}
