import { useState } from 'react';
import { TriviaEvent, TriviaRound } from '../types/trivia';
import RoundEditor from '../components/RoundEditor';
import RoundList from '../components/RoundList';
import { Box, Typography, TextField, Paper } from '@mui/material';

export default function EventConfig() {
  const [event, setEvent] = useState<TriviaEvent>({
    id: crypto.randomUUID(),
    name: '',
    date: new Date(),
    host: '',
    rounds: [],
    status: 'upcoming',
  });
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  const addNewRound = () => {
    const newRound: TriviaRound = {
      id: crypto.randomUUID(),
      name: `Round ${event.rounds.length + 1}`,
      roundNumber: event.rounds.length + 1,
      questions: [],
    };
    setEvent((prev) => ({
      ...prev,
      rounds: [...prev.rounds, newRound],
    }));
  };

  const updateRound = (updatedRound: TriviaRound) => {
    setEvent((prev) => ({
      ...prev,
      rounds: prev.rounds.map((r) =>
        r.id === updatedRound.id ? updatedRound : r
      ),
    }));
  };

  const deleteRound = (roundId: string) => {
    setEvent((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((r) => r.id !== roundId),
    }));
    if (selectedRoundId === roundId) {
      setSelectedRoundId(null);
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
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, name: e.target.value }))
          }
          label="Event Name"
          sx={{ mb: 2 }}
        />
        {/* Add other event fields as needed */}
      </Paper>

      {selectedRoundId ? (
        <RoundEditor
          round={event.rounds.find((r) => r.id === selectedRoundId)!}
          onSave={updateRound}
          onComplete={() => setSelectedRoundId(null)}
        />
      ) : (
        <RoundList
          rounds={event.rounds}
          onAddRound={addNewRound}
          onEditRound={setSelectedRoundId}
          onDeleteRound={deleteRound}
        />
      )}
    </Box>
  );
}
