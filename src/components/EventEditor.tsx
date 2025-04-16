import { useNavigate } from '@tanstack/react-router';
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

export default function EventEditor() {
  const navigate = useNavigate();
  const { event, setEvent, addRound } = useEvent();
  const { updateRound, deleteRound, saveEvent, isLoadingEvent } =
    useTriviaStore();

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

  const handleEditRound = (roundId: string) => {
    if ('id' in event) {
      navigate({
        to: `/events/${event.id}/rounds/${roundId}`,
      });
    }
  };

  const handleSave = () => {
    if (event?.name) {
      saveEvent(event);
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
          value={event.name}
          onChange={(e) => setEvent({ ...event, name: e.target.value })}
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
