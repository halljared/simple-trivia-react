import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TriviaEvent, TriviaRound } from '../types/trivia';
import RoundList from '../components/RoundList';
import { Box, Typography, TextField, Paper } from '@mui/material';

export default function EventConfig() {
  const navigate = useNavigate();
  const [event, setEvent] = useState<TriviaEvent>({
    id: crypto.randomUUID(),
    name: '',
    date: new Date(),
    host: '',
    rounds: [],
    status: 'upcoming',
  });

  // Load event from localStorage if it exists
  useEffect(() => {
    const storedEvent = localStorage.getItem(`event-${event.id}`);
    if (storedEvent) {
      setEvent(JSON.parse(storedEvent));
    }
  }, []);

  // Save event to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`event-${event.id}`, JSON.stringify(event));
  }, [event]);

  const updateRound = (updatedRound: TriviaRound) => {
    setEvent((prev) => {
      const existingRoundIndex = prev.rounds.findIndex(
        (r) => r.id === updatedRound.id
      );
      if (existingRoundIndex === -1) {
        // Add new round
        return {
          ...prev,
          rounds: [...prev.rounds, updatedRound],
        };
      } else {
        // Update existing round
        return {
          ...prev,
          rounds: prev.rounds.map((r) =>
            r.id === updatedRound.id ? updatedRound : r
          ),
        };
      }
    });
  };

  const deleteRound = (roundId: string) => {
    setEvent((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((r) => r.id !== roundId),
    }));
  };

  const handleEditRound = (roundId: string) => {
    navigate({
      to: `/events/${event.id}/rounds/${roundId}`,
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
          value={event.name}
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, name: e.target.value }))
          }
          label="Event Name"
          sx={{ mb: 2 }}
        />
        {/* Add other event fields as needed */}
      </Paper>

      <RoundList
        event={event}
        onEditRound={handleEditRound}
        onUpdateRound={updateRound}
        onDeleteRound={deleteRound}
      />
    </Box>
  );
}
