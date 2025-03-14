import { useState } from 'react';
import { TriviaRound, TriviaQuestion } from '../types/trivia';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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

  const addQuestion = () => {
    const newQuestion: TriviaQuestion = {
      id: crypto.randomUUID(),
      questionText: '',
      answerText: '',
      points: 1,
      type: 'multiple-choice',
      difficulty: 'medium',
      options: ['', '', '', ''],
    };
    setEditedRound((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setEditingQuestionId(newQuestion.id);
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

  const handleSave = () => {
    onSave(editedRound);
    onComplete();
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
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<AddIcon />}
        >
          Complete Round
        </Button>
      </Box>

      {/* Round Details */}
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
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editedRound.description || ''}
              onChange={(e) =>
                setEditedRound((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              label="Round Description"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Stack spacing={2}>
        {editedRound.questions.map((question) => (
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
                      {question.questionText || '(No question text)'}
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
        <Button
          onClick={addQuestion}
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
        >
          Add New Question
        </Button>
      </Stack>
    </Stack>
  );
}
