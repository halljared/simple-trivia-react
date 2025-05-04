import { useState } from 'react';
import { TriviaRound } from '../types/trivia';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTriviaStore } from '@/stores/triviaStore';
import { useEvent } from '@/contexts/EventContext';
import { useNavigate } from '@tanstack/react-router';

interface RoundListProps {
  rounds: TriviaRound[];
}

export default function RoundList({ rounds }: RoundListProps) {
  const [deletingRounds, setDeletingRounds] = useState<Set<number>>(new Set());
  const { addRound, deleteRound } = useTriviaStore();
  const { event } = useEvent();
  const navigate = useNavigate();

  const onEditRound = (roundId: number) => {
    if (!event) return;
    if ('id' in event) {
      navigate({
        to: `/events/${event.id}/rounds/${roundId}`,
      });
    }
  };

  const onAddRound = async () => {
    if (!event || !('id' in event)) return;
    try {
      const newRound = await addRound();
      navigate({
        to: `/events/${event.id}/rounds/${newRound.id}`,
      });
    } catch (error) {
      console.error('Failed to add round:', error);
    }
  };

  const onDeleteRound = async (roundId: number) => {
    setDeletingRounds((prev) => new Set<number>(prev).add(roundId));
    try {
      await deleteRound(roundId);
    } catch (error) {
      console.error('Failed to delete round:', error);
    } finally {
      setDeletingRounds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(roundId);
        return newSet;
      });
    }
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
        {rounds.map((round) => {
          const isDeleting = deletingRounds.has(round.id);
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
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
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
