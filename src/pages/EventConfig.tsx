import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { TriviaEvent, TriviaRound } from '../types/trivia';
import RoundList from '../components/RoundList';
import { Box, Typography, TextField, Paper } from '@mui/material';
import { useEventStore } from '../stores/eventStore';

export default function EventConfig() {
  const navigate = useNavigate();
  const { currentEvent, setEvent, updateRound, deleteRound } = useEventStore();

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

      const storedEvent = localStorage.getItem(`event-${newEvent.id}`);
      if (storedEvent) {
        setEvent(JSON.parse(storedEvent));
      } else {
        setEvent(newEvent);
      }
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
        event={currentEvent}
        onEditRound={handleEditRound}
        onUpdateRound={updateRound}
        onDeleteRound={deleteRound}
      />
    </Box>
  );
}
