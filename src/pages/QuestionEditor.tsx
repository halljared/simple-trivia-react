// QuestionEditor.tsx
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import QuestionList from '../components/QuestionList';
import { questionEditorRoute, createQuizRoute } from '../config/routes';
import { useTriviaStore } from '../stores/triviaStore';
import { Breadcrumbs, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function QuestionEditor() {
  const navigate = useNavigate();
  const { eventId, roundId } = questionEditorRoute.useParams();
  const { currentRound, setCurrentRound, loadEvent, currentEvent } =
    useTriviaStore();

  useEffect(() => {
    // Load the event if it's not already loaded.
    loadEvent(eventId);
    // Set the current round.  This will happen *after* loadEvent is complete.
    setCurrentRound(roundId);
  }, [eventId, roundId, loadEvent, setCurrentRound]);

  if (!currentRound) {
    return <div>Loading...</div>; // currentRound is what we're editing
  }

  return (
    <>
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Typography color="text.secondary">{currentEvent?.name}</Typography>
          <Typography color="text.secondary">{currentRound.name}</Typography>
          <Typography color="text.primary">Questions</Typography>
        </Breadcrumbs>
      </Box>
      <QuestionList
        onSave={() => navigate({ to: createQuizRoute.id })}
        onBack={() => navigate({ to: createQuizRoute.id })}
      />
    </>
  );
}
