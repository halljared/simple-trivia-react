import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useTriviaStore } from '@/stores/triviaStore';
import { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { ListEvent } from '@/types/trivia';
import { editQuizRoute } from '@/config/routes';

export default function EventList() {
  const navigate = useNavigate();
  const { events, loadEvents, deleteEvent, isDeletingEvent, isLoadingEvents } =
    useTriviaStore();

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleEdit = (event: ListEvent) => {
    navigate({ to: editQuizRoute.id, params: { eventId: event.id } });
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Failed to delete event:', error);
      // You might want to show an error message to the user here
    }
  };

  if (isLoadingEvents) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No events found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>
                  {event.event_date
                    ? new Date(event.event_date).toLocaleDateString()
                    : ''}
                </TableCell>
                <TableCell>{event.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(event)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(event.id)}
                    color="error"
                    disabled={isDeletingEvent}
                  >
                    {isDeletingEvent ? (
                      <CircularProgress size={24} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
