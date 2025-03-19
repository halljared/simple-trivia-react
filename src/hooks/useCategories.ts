import { useState, useEffect } from 'react';
import { useTriviaStore } from '../stores/triviaStore';

export function useCategories() {
  const [isLoading, setIsLoading] = useState(true);
  const { categories, fetchCategories } = useTriviaStore();

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        await fetchCategories();
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, [fetchCategories]);

  return { categories, isLoading };
}
