import { Chip, Stack } from '@mui/material';
import { TriviaQuestion } from '../types/trivia';
import { difficultyDisplayMap } from '../util/helpers';

// Map question types to colors and display text
const typeColorMap: Record<string, 'primary' | 'secondary' | 'info'> = {
  'multiple-choice': 'primary',
  'true-false': 'secondary',
  'open-ended': 'info',
};

const typeDisplayMap: Record<string, string> = {
  'multiple-choice': 'Multiple Choice',
  'true-false': 'True/False',
  'open-ended': 'Open Ended',
};

// Map difficulty to colors and display text
const difficultyColorMap: Record<string, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

interface QuestionViewProps {
  question: TriviaQuestion;
}

export function QuestionView({ question }: QuestionViewProps) {
  return (
    <div>
      <div>{question.question}</div>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Chip
          label={typeDisplayMap[question.type] || question.type}
          color={typeColorMap[question.type] || 'default'}
          size="small"
        />
        <Chip
          label={
            difficultyDisplayMap[question.difficulty] || question.difficulty
          }
          color={difficultyColorMap[question.difficulty] || 'default'}
          size="small"
        />
      </Stack>
    </div>
  );
}
