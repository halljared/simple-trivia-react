import { useNavigate } from '@tanstack/react-router';
import RoundList from '../components/RoundList';
import { Box, Typography, TextField, Paper } from '@mui/material';
import { useEvent } from '@/contexts/EventContext';
import { useTriviaStore } from '@/stores/triviaStore';
import { useEffect } from 'react';

export default function EventEditor() {
  const navigate = useNavigate();
  const { event, setEvent } = useEvent();
  const {
    updateRound,
    deleteRound,
    addRound,
    setEvent: saveEvent,
  } = useTriviaStore();

  useEffect(() => {
    return () => {
      // TODO: Use a dirty flag instead of checking if the event has a name
      if (event?.name) {
        saveEvent(event);
      }
    };
  }, [event, saveEvent]);

  if (!event) return null;

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
          onChange={(e) => setEvent({ ...event, name: e.target.value })}
          label="Event Name"
          sx={{ mb: 2 }}
        />
        {/* Add other event fields as needed */}
      </Paper>

      <RoundList
        rounds={event.rounds}
        onEditRound={handleEditRound}
        onUpdateRound={updateRound}
        onDeleteRound={deleteRound}
        onAddRound={addRound}
      />
    </Box>
  );
}
