import { useState, useEffect } from 'react';
import { TriviaRound, TriviaQuestion, TriviaEvent } from '../types/trivia';
import { useTriviaStore } from '../stores/triviaStore';
import QuestionEditor from './QuestionEditor';
import { QuestionItem } from './QuestionItem';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  IconButton,
  FormControl,
  Autocomplete,
  Breadcrumbs,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface QuestionListProps {
  event: TriviaEvent;
  round: TriviaRound;
  onSave: (round: TriviaRound) => void;
  onBack: () => void;
}

export default function QuestionList({
  event,
  round,
  onSave,
  onBack,
}: QuestionListProps) {
  const [editedRound, setEditedRound] = useState<TriviaRound>(round);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { categories, fetchCategories, fetchQuestionsForCategory } =
    useTriviaStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const initializeEmptyQuestions = async (count: number) => {
    if (!editedRound.categoryId) return;
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const updateQuestion = (updatedQuestion: TriviaQuestion) => {
    setEditedRound((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    }));
    setEditingQuestionId(null);
  };

  const deleteQuestion = (questionId: string) => {
    setEditedRound((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

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
          <Button variant="contained" onClick={() => onSave(editedRound)}>
            Save Questions
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <Autocomplete
                value={
                  categories.find((cat) => cat.id === editedRound.categoryId) ||
                  null
                }
                onChange={(_, newValue) => {
                  setEditedRound((prev) => ({
                    ...prev,
                    categoryId: newValue?.id || undefined,
                  }));
                }}
                options={categories.sort(
                  (a, b) => b.question_count - a.question_count
                )}
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
                onClick={() => initializeEmptyQuestions(questionCount)}
                disabled={!editedRound.categoryId}
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
        ) : editedRound.questions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No questions added yet. Select a category and create some
              questions to get started.
            </Typography>
          </Box>
        ) : (
          editedRound.questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent>
                {editingQuestionId === question.id ? (
                  <QuestionEditor
                    question={question}
                    onSave={updateQuestion}
                    onCancel={() => setEditingQuestionId(null)}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Question {index + 1}
                      </Typography>
                      <QuestionItem question={question} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                      <IconButton
                        onClick={() => setEditingQuestionId(question.id)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteQuestion(question.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
}
