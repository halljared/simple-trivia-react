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
        value={editedQuestion.question}
        onChange={(e) =>
          setEditedQuestion((prev) => ({
            ...prev,
            question: e.target.value,
          }))
        }
        label="Question"
      />

      <TextField
        fullWidth
        value={editedQuestion.answer}
        onChange={(e) =>
          setEditedQuestion((prev) => ({
            ...prev,
            answer: e.target.value,
          }))
        }
        label="Answer"
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
