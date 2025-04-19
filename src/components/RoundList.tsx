import { useState } from 'react';
import { NewTriviaRound } from '../types/trivia';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTriviaStore } from '@/stores/triviaStore';
interface RoundListProps {
  rounds: NewTriviaRound[];
  onEditRound: (roundId: string) => void;
}
interface TempRound extends NewTriviaRound {
  isTemp: boolean;
}

export default function RoundList({ rounds, onEditRound }: RoundListProps) {
  const [tempRounds, setTempRounds] = useState<TempRound[]>([]);
  const { addRound, deleteRound } = useTriviaStore();

  const onAddRound = async () => {
    const numRounds = rounds.length;
    const tempRound: TempRound = {
      id: crypto.randomUUID(),
      name: `Round ${numRounds + 1}`,
      roundNumber: numRounds + 1,
      questions: [],
      isTemp: true,
    };

    setTempRounds((prev) => [...prev, tempRound]);

    try {
      await addRound();
    } catch (error) {
      setTempRounds((prev) =>
        prev.filter((round) => round.id !== tempRound.id)
      );
      console.error('Failed to add round:', error);
    } finally {
      setTempRounds((prev) =>
        prev.filter((round) => round.id !== tempRound.id)
      );
    }
  };

  const onDeleteRound = async (roundId: string) => {
    await deleteRound(roundId);
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
                    <Typography variant="h6" sx={{ mb: '4px' }}>
                      {round.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {round.questions.length} questions
                      {round.categoryId &&
                        ` • From category ${round.categoryId}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
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
