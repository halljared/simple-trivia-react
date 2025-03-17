import { useState } from 'react';
import { TriviaRound, TriviaEvent } from '../types/trivia';
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

interface RoundListProps {
  event: TriviaEvent;
  onEditRound: (roundId: string) => void;
  onUpdateRound: (round: TriviaRound) => void;
  onDeleteRound: (roundId: string) => void;
}

export default function RoundList({
  event,
  onEditRound,
  onUpdateRound,
  onDeleteRound,
}: RoundListProps) {
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editedRoundName, setEditedRoundName] = useState<string>('');

  const startEditing = (round: TriviaRound) => {
    setEditingRoundId(round.id);
    setEditedRoundName(round.name);
  };

  const saveRoundName = (round: TriviaRound) => {
    onUpdateRound({
      ...round,
      name: editedRoundName,
    });
    setEditingRoundId(null);
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
        <Typography variant="h5">Rounds</Typography>
        <Button
          variant="contained"
          onClick={() =>
            onUpdateRound({
              id: crypto.randomUUID(),
              name: 'New Round',
              questions: [],
            })
          }
        >
          Add Round
        </Button>
      </Box>

      <Stack spacing={2}>
        {event.rounds.map((round) => (
          <Card key={round.id}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  {editingRoundId === round.id ? (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        value={editedRoundName}
                        onChange={(e) => setEditedRoundName(e.target.value)}
                        size="small"
                      />
                      <Button onClick={() => saveRoundName(round)}>Save</Button>
                      <Button onClick={() => setEditingRoundId(null)}>
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h6">{round.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {round.questions.length} questions
                        {round.categoryId && ' • From category'}
                      </Typography>
                    </>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => onEditRound(round.id)}
                  >
                    Configure Questions
                  </Button>
                  <IconButton
                    onClick={() => startEditing(round)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteRound(round.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
