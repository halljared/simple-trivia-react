import { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        value={editedQuestion.questionText}
        onChange={(e) =>
          setEditedQuestion((prev) => ({
            ...prev,
            questionText: e.target.value,
          }))
        }
        placeholder="Question Text"
        label="Question Text"
      />

      <FormControl fullWidth>
        <InputLabel id="question-type-label">Question Type</InputLabel>
        <Select
          labelId="question-type-label"
          value={editedQuestion.type}
          label="Question Type"
          onChange={(e) =>
            setEditedQuestion((prev) => ({
              ...prev,
              type: e.target.value as TriviaQuestion['type'],
            }))
          }
        >
          <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
          <MenuItem value="true-false">True/False</MenuItem>
          <MenuItem value="open-ended">Open Ended</MenuItem>
        </Select>
      </FormControl>

      {editedQuestion.type === 'multiple-choice' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {editedQuestion.options?.map((option, index) => (
            <TextField
              key={index}
              fullWidth
              value={option}
              onChange={(e) => {
                const newOptions = [...(editedQuestion.options || [])];
                newOptions[index] = e.target.value;
                setEditedQuestion((prev) => ({ ...prev, options: newOptions }));
              }}
              placeholder={`Option ${index + 1}`}
              label={`Option ${index + 1}`}
            />
          ))}
        </Box>
      )}

      <TextField
        fullWidth
        value={editedQuestion.answerText}
        onChange={(e) =>
          setEditedQuestion((prev) => ({ ...prev, answerText: e.target.value }))
        }
        placeholder="Correct Answer"
        label="Correct Answer"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => onSave(editedQuestion)}>
          Save Question
        </Button>
      </Box>
    </Box>
  );
}
