import { QuestionType } from '../types/trivia';

/**
 * Maps a string representation of question type to the QuestionType enum
 * @param typeStr The string or enum value to map
 * @returns The matching QuestionType enum value or OPEN_ENDED as default
 */
export const mapQuestionType = (
  typeStr: string | QuestionType
): QuestionType => {
  // If it's already a QuestionType, return it
  if (Object.values(QuestionType).includes(typeStr as QuestionType)) {
    return typeStr as QuestionType;
  }
  // Otherwise, find the matching enum value for the string
  const enumValue = Object.values(QuestionType).find((val) => val === typeStr);
  return enumValue || QuestionType.OPEN_ENDED; // Default to OPEN_ENDED if no match
};
