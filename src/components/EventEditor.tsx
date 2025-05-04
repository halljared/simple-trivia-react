import RoundList from '../components/RoundList';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { useEvent } from '@/contexts/EventContext';
import { useTriviaStore } from '@/stores/triviaStore';
import { useState, useEffect } from 'react';

export default function EventEditor() {
  const { event } = useEvent();
  const [eventName, setEventName] = useState('');
  const { saveEvent, isLoadingEvent } = useTriviaStore();

  useEffect(() => {
    if (event) {
      setEventName(event.name);
    }
  }, [event]);

  if (isLoadingEvent) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <CircularProgress size={100} />
      </Box>
    );
  }

  if (!event) return null;

  const handleSave = () => {
    if (eventName) {
      saveEvent({ ...event, name: eventName });
    }
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
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          label="Event Name"
          sx={{ mb: 2 }}
        />
        {/* Add other event fields as needed */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Save Event
        </Button>
      </Paper>

      <RoundList rounds={event.rounds} />
    </Box>
  );
}
