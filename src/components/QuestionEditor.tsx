import { useState } from 'react';
import { TextField, Button, Box, Stack } from '@mui/material';
import { TriviaQuestion } from '../types/trivia';

interface QuestionEditorProps {
  question: TriviaQuestion;
  onSave: (question: TriviaQuestion) => void;
  onCancel: () => void;
}

export default function QuestionEditor({
  question,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] =
    useState<TriviaQuestion>(question);

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        multiline
        rows={2}
        value={editedQuestion.questionText}
        onChange={(e) =>
          setEditedQuestion((prev) => ({
            ...prev,
            questionText: e.target.value,
          }))
        }
        label="Question Text"
      />

      <TextField
        fullWidth
        value={editedQuestion.answerText}
        onChange={(e) =>
          setEditedQuestion((prev) => ({
            ...prev,
            answerText: e.target.value,
          }))
        }
        label="Correct Answer"
      />

      <TextField
        type="number"
        value={editedQuestion.points}
        onChange={(e) =>
          setEditedQuestion((prev) => ({
            ...prev,
            points: parseInt(e.target.value) || 1,
          }))
        }
        label="Points"
        sx={{ width: 200 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onSave(editedQuestion)}>
          Save Question
        </Button>
      </Box>
    </Stack>
  );
}
