import { TriviaRound } from '../types/trivia';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface RoundListProps {
  rounds: TriviaRound[];
  onAddRound: () => void;
  onEditRound: (roundId: string) => void;
  onDeleteRound: (roundId: string) => void;
}

export default function RoundList({
  rounds,
  onAddRound,
  onEditRound,
  onDeleteRound,
}: RoundListProps) {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Rounds
      </Typography>
      <Stack spacing={2}>
        {rounds.map((round) => (
          <Card key={round.id}>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h6">{round.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {round.questions.length} questions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => onEditRound(round.id)}
                  variant="outlined"
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => onDeleteRound(round.id)}
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
        <Button
          onClick={onAddRound}
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          sx={{ borderStyle: 'dashed' }}
        >
          Add New Round
        </Button>
      </Stack>
    </Box>
  );
}
