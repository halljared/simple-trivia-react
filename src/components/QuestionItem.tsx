import { useState } from 'react';
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import { TriviaQuestion } from '../types/trivia';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionEditor from './QuestionEditor';
import { QuestionView } from './QuestionView';
import { useTriviaStore } from '@/stores/triviaStore';

interface QuestionItemProps {
  question: TriviaQuestion;
  index: number;
}

export function QuestionItem({ question, index }: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateQuestion, deleteQuestion } = useTriviaStore();

  const handleSave = (updatedQuestion: TriviaQuestion) => {
    updateQuestion(updatedQuestion);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <QuestionEditor
            question={question}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
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
              <QuestionView question={question} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <IconButton onClick={() => setIsEditing(true)} color="primary">
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
  );
}
