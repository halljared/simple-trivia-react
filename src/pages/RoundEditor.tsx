import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import QuestionList from '../components/QuestionList';
import { roundEditorRoute, createQuizRoute } from '../config/routes';
import { useTriviaStore } from '../stores/triviaStore';
import { Breadcrumbs, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function RoundEditor() {
  const navigate = useNavigate();
  const { roundId } = roundEditorRoute.useParams();
  const {
    currentRound,
    isLoadingRound,
    loadRound,
    event: currentEvent,
  } = useTriviaStore();

  useEffect(() => {
    // Load the round directly
    loadRound(roundId);
  }, [roundId, loadRound]);

  if (isLoadingRound || !currentRound) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Typography color="text.secondary">
            {currentEvent?.name || 'Event'}
          </Typography>
          <Typography color="text.secondary">{currentRound.name}</Typography>
          <Typography color="text.primary">Questions</Typography>
        </Breadcrumbs>
      </Box>
      <QuestionList
        onSave={() => navigate({ to: createQuizRoute.id })}
        onBack={() => navigate({ to: createQuizRoute.id })}
        questions={currentRound.questions}
      />
    </>
  );
}
