import { useState, useEffect, useMemo } from 'react';
import { TriviaRound, TriviaQuestion } from '../types/trivia';
import { useTriviaStore } from '../stores/triviaStore';
import QuestionEditor from './QuestionEditor';
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
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface RoundEditorProps {
  round: TriviaRound;
  onSave: (round: TriviaRound) => void;
  onComplete: () => void;
}

export default function RoundEditor({
  round,
  onSave,
  onComplete,
}: RoundEditorProps) {
  const [editedRound, setEditedRound] = useState<TriviaRound>(round);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [categorySearch, setCategorySearch] = useState('');

  const { categories, fetchCategories, fetchQuestionsForCategory } =
    useTriviaStore();

  const filteredCategories = useMemo(
    () =>
      categories
        .filter((cat) =>
          cat.name.toLowerCase().includes(categorySearch.toLowerCase())
        )
        .sort((a, b) => b.question_count - a.question_count),
    [categories, categorySearch]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const initializeEmptyQuestions = (count: number) => {
    const emptyQuestions: TriviaQuestion[] = Array(count)
      .fill(null)
      .map(() => ({
        id: crypto.randomUUID(),
        questionText: '',
        answerText: '',
        points: 1,
        type: 'open-ended',
        difficulty: 'medium',
      }));

    setEditedRound((prev) => ({
      ...prev,
      questions: emptyQuestions,
    }));
  };

  const fillQuestionsFromAPI = async () => {
    if (!editedRound.categoryId) return;

    const apiQuestions = await fetchQuestionsForCategory(
      editedRound.categoryId,
      editedRound.questions.length
    );

    setEditedRound((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) => {
        if (q.questionText) return q; // Keep existing questions
        const apiQ = apiQuestions[index];
        if (!apiQ) return q; // Keep original if no API question available

        return {
          ...q,
          questionText: apiQ.questionText,
          answerText: apiQ.answerText,
          type: apiQ.type || q.type,
          difficulty: apiQ.difficulty || q.difficulty,
          points: apiQ.points || q.points,
        };
      }),
    }));
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">Editing Round: {editedRound.name}</Typography>
        <Button variant="contained" onClick={() => onSave(editedRound)}>
          Complete Round
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              value={editedRound.name}
              onChange={(e) =>
                setEditedRound((prev) => ({ ...prev, name: e.target.value }))
              }
              label="Round Name"
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editedRound.categoryId || ''}
                onChange={(e) =>
                  setEditedRound((prev) => ({
                    ...prev,
                    categoryId: e.target.value as number,
                  }))
                }
                label="Category"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                <MenuItem>
                  <TextField
                    size="small"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => {
                      e.stopPropagation();
                      setCategorySearch(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                </MenuItem>
                {filteredCategories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                    sx={{ py: 1 }}
                  >
                    {category.name} ({category.question_count} questions)
                  </MenuItem>
                ))}
              </Select>
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
              >
                Initialize Questions
              </Button>
              {editedRound.categoryId && (
                <Button
                  variant="contained"
                  startIcon={<AutorenewIcon />}
                  onClick={fillQuestionsFromAPI}
                >
                  Fill Empty Questions from API
                </Button>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {editedRound.questions.map((question, index) => (
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
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      Question {index + 1}:{' '}
                      {question.questionText || '(Empty question)'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {question.type} - {question.points} points
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
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
        ))}
      </Stack>
    </Stack>
  );
}
