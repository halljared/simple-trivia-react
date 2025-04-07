import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useTriviaStore } from '@/stores/triviaStore';
import { useEffect } from 'react';
import { useEvent } from '@/contexts/EventContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { TriviaEvent } from '@/types/trivia';
import { editQuizRoute } from '@/config/routes';
export default function EventList() {
  const navigate = useNavigate();
  const { events, loadEvents } = useTriviaStore();
  const { setEvent } = useEvent();

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleEdit = (event: TriviaEvent) => {
    setEvent(event);
    navigate({ to: editQuizRoute.id, params: { eventId: event.id } });
  };

  const handleDelete = (eventId: string) => {
    // Remove from local storage
    localStorage.removeItem(`event-${eventId}`);
    // Remove from events list
    const updatedEvents = events.filter((e) => e.id !== eventId);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    // Reload events
    loadEvents();
  };

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{event.host}</TableCell>
                <TableCell>{event.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(event)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(event.id)}
                    color="error"
                  >
                    <DeleteIcon />
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
