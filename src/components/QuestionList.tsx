import { useState } from 'react';
import {
  TriviaRound,
  TriviaQuestion,
  TriviaEvent,
  TriviaCategory,
} from '../types/trivia';
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
  Breadcrumbs,
  CircularProgress,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface QuestionListProps {
  event: TriviaEvent;
  round: TriviaRound;
  categories: TriviaCategory[];
  onSave: (round: TriviaRound) => void;
  onBack: () => void;
  onUpdateQuestion: (question: TriviaQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  onAddQuestions: (count: number) => Promise<void>;
  onCategoryChange: (categoryId: number | undefined) => void;
  isLoading: boolean;
  isLoadingCategories: boolean;
}

export default function QuestionList({
  event,
  round,
  categories,
  onSave,
  onBack,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestions,
  onCategoryChange,
  isLoading,
  isLoadingCategories,
}: QuestionListProps) {
  const [questionCount, setQuestionCount] = useState<number>(10);

  return (
    <Stack spacing={3}>
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Typography color="text.secondary">{event.name}</Typography>
          <Typography color="text.secondary">{round.name}</Typography>
          <Typography color="text.primary">Questions</Typography>
        </Breadcrumbs>
      </Box>

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
          <Button variant="contained" onClick={() => onSave(round)}>
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
                  categories?.find((cat) => cat.id === round.categoryId) || null
                }
                onChange={(_, newValue) => {
                  onCategoryChange(newValue?.id);
                }}
                options={
                  categories?.sort(
                    (a, b) => b.question_count - a.question_count
                  ) || []
                }
                getOptionLabel={(option) =>
                  `${option.name} (${option.question_count} questions)`
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
                onClick={() => onAddQuestions(questionCount)}
                disabled={!round.categoryId}
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
        ) : round.questions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No questions added yet. Select a category and create some
              questions to get started.
            </Typography>
          </Box>
        ) : (
          round.questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              onUpdate={onUpdateQuestion}
              onDelete={onDeleteQuestion}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
}
