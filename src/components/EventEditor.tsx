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
import { NewTriviaEvent, TriviaEvent } from '@/types/trivia';
import { EventStatus } from '@/types/trivia';

export default function EventEditor() {
  const { event } = useEvent();
  const [newEvent, setNewEvent] = useState<NewTriviaEvent | null>(null);
  const { saveEvent, isLoadingEvent } = useTriviaStore();
  const [thisEvent, setThisEvent] = useState<
    TriviaEvent | NewTriviaEvent | null
  >(null);

  useEffect(() => {
    if (!event) {
      setNewEvent({
        name: '',
        eventDate: new Date(),
        rounds: [],
        status: EventStatus.UPCOMING,
      });
    }
  }, [event]);

  useEffect(() => {
    setThisEvent(event ?? newEvent);
  }, [event, newEvent]);

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

  const handleSave = () => {
    if (thisEvent) {
      saveEvent({ ...thisEvent });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (thisEvent) {
      setThisEvent({ ...thisEvent, name: e.target.value });
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
          value={thisEvent?.name ?? ''}
          onChange={handleNameChange}
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

      <RoundList rounds={thisEvent?.rounds ?? []} />
    </Box>
  );
}
