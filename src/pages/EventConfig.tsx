import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TriviaEvent } from '../types/trivia';
import RoundList from '../components/RoundList';
import { Box, Typography, TextField, Paper } from '@mui/material';
import { useTriviaStore } from '../stores/triviaStore';

export default function EventConfig() {
  const navigate = useNavigate();
  const { currentEvent, setEvent, updateRound, deleteRound, addRound } =
    useTriviaStore();

  // Initialize event if none exists
  useEffect(() => {
    if (!currentEvent) {
      const newEvent: TriviaEvent = {
        id: crypto.randomUUID(),
        name: '',
        date: new Date(),
        host: '',
        rounds: [],
        status: 'upcoming',
      };
      setEvent(newEvent);
    }
  }, [currentEvent, setEvent]);

  if (!currentEvent) return null;

  const handleEditRound = (roundId: string) => {
    navigate({
      to: `/events/${currentEvent.id}/rounds/${roundId}`,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Event Details Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Configure Event
        </Typography>
        <TextField
          fullWidth
          value={currentEvent.name}
          onChange={(e) => setEvent({ ...currentEvent, name: e.target.value })}
          label="Event Name"
          sx={{ mb: 2 }}
        />
        {/* Add other event fields as needed */}
      </Paper>

      <RoundList
        rounds={currentEvent.rounds}
        onEditRound={handleEditRound}
        onUpdateRound={updateRound}
        onDeleteRound={deleteRound}
        onAddRound={addRound}
      />
    </Box>
  );
}
