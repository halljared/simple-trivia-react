import { useState } from 'react';
import { QuestionItem } from './QuestionItem';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  FormControl,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { useCategories } from '../hooks/useCategories';
import { useTriviaStore } from '../stores/triviaStore';
import { TriviaQuestion } from '../types/trivia';
interface QuestionListProps {
  onSave: () => void; // Simplified: No need to pass round back
  onBack: () => void;
  questions: TriviaQuestion[];
}

export default function QuestionList({
  onSave,
  onBack,
  questions,
}: QuestionListProps) {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { currentRound, isLoading, addQuestions, setCategoryId } =
    useTriviaStore();

  // VERY IMPORTANT: Guard against null currentRound.  This can happen
  // while the event/round is loading.
  if (!currentRound) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography>Loading round...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">Configure Questions</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={onBack}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSave}>
            {' '}
            {/* Simplified save */}
            Save Questions
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <Autocomplete
                loading={isLoadingCategories}
                value={
                  categories?.find(
                    (cat) => cat.id === currentRound.categoryId
                  ) || null
                }
                onChange={(_, newValue) => {
                  setCategoryId(newValue?.id);
                }}
                options={
                  categories?.sort(
                    (a, b) => b.questionCount - a.questionCount
                  ) || []
                }
                getOptionLabel={(option) =>
                  `${option.name} (${option.questionCount} questions)`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    placeholder="Search categories..."
                  />
                )}
                ListboxProps={{
                  style: {
                    maxHeight: 300,
                  },
                }}
              />
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                label="Number of Questions"
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(parseInt(e.target.value) || 0)
                }
                sx={{ width: 200 }}
              />
              <Button
                variant="outlined"
                onClick={() => addQuestions(questionCount)}
                disabled={!currentRound.categoryId}
              >
                Create Questions
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Loading questions...
            </Typography>
          </Box>
        ) : questions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No questions added yet. Select a category and create some
              questions to get started.
            </Typography>
          </Box>
        ) : (
          questions.map((question, index) => (
            <QuestionItem key={question.id} question={question} index={index} />
          ))
        )}
      </Stack>
    </Stack>
  );
}
