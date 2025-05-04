import { QuestionDifficulty, QuestionType } from '../types/trivia';

/**
 * Maps a string representation of question type to the QuestionType enum
 * @param typeStr The string or enum value to map
 * @returns The matching QuestionType enum value or USER as default
 */
export const mapQuestionType = (
  typeStr: string | QuestionType
): QuestionType => {
  if (Object.values(QuestionType).includes(typeStr as QuestionType)) {
    return typeStr as QuestionType;
  }
  const enumValue = Object.values(QuestionType).find((val) => val === typeStr);
  return enumValue || QuestionType.USER;
};

export const difficultyDisplayMap: Record<QuestionDifficulty, string> = {
  [QuestionDifficulty.EASY]: 'Easy',
  [QuestionDifficulty.MEDIUM]: 'Medium',
  [QuestionDifficulty.HARD]: 'Hard',
};
