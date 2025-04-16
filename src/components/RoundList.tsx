import { useState } from 'react';
import { NewTriviaRound } from '../types/trivia';
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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTriviaStore } from '@/stores/triviaStore';
interface RoundListProps {
  rounds: NewTriviaRound[];
  onEditRound: (roundId: string) => void;
  onUpdateRound: (round: NewTriviaRound) => void;
  onDeleteRound: (roundId: string) => void;
}
interface TempRound extends NewTriviaRound {
  isTemp: boolean;
}

export default function RoundList({
  rounds,
  onEditRound,
  onUpdateRound,
  onDeleteRound,
}: RoundListProps) {
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editedRoundName, setEditedRoundName] = useState<string>('');
  const [tempRounds, setTempRounds] = useState<TempRound[]>([]);
  const { addRound } = useTriviaStore();

  const startEditing = (round: NewTriviaRound) => {
    setEditingRoundId(round.id);
    setEditedRoundName(round.name);
  };

  const saveRoundName = (round: NewTriviaRound) => {
    onUpdateRound({
      ...round,
      name: editedRoundName,
    });
    setEditingRoundId(null);
  };

  const onAddRound = async () => {
    const numRounds = rounds.length;
    const tempRound: TempRound = {
      id: crypto.randomUUID(),
      name: `Round ${numRounds + 1}`,
      roundNumber: numRounds + 1,
      questions: [],
      isTemp: true,
    };
    setTempRounds([...tempRounds, tempRound]);
    await addRound();
    setTempRounds(tempRounds.filter((round) => round.id !== tempRound.id));
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
        <Button variant="contained" onClick={onAddRound}>
          Add Round
        </Button>
      </Box>

      <Stack spacing={2}>
        {[...rounds, ...tempRounds].map((round) => {
          return (
            <Card key={round.id}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    minHeight: '48px',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    {editingRoundId === round.id ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <TextField
                            fullWidth
                            value={editedRoundName}
                            onChange={(e) => setEditedRoundName(e.target.value)}
                            size="small"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRoundName(round);
                              if (e.key === 'Escape') setEditingRoundId(null);
                            }}
                            autoFocus
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '32px',
                              },
                              mb: '4px',
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {round.questions.length} questions
                            {round.categoryId && ' • From category'}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ mb: '4px' }}>
                          {round.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {round.categoryId &&
                            ` • From category ${round.categoryId}`}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Edit mode buttons */}
                    <IconButton
                      size="small"
                      onClick={() => saveRoundName(round)}
                      color="primary"
                      sx={{
                        display: editingRoundId === round.id ? 'flex' : 'none',
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setEditingRoundId(null)}
                      sx={{
                        display: editingRoundId === round.id ? 'flex' : 'none',
                      }}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Normal mode buttons */}
                    <IconButton
                      onClick={() => startEditing(round)}
                      color="primary"
                      sx={{
                        display: editingRoundId === round.id ? 'none' : 'flex',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onEditRound(round.id)}
                      color="primary"
                    >
                      <QuizIcon />
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
          );
        })}
      </Stack>
    </Stack>
  );
}
