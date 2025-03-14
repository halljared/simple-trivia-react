import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome to your trivia builder dashboard. Create and manage your
          trivia games from here.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Recent Quizzes" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No quizzes created yet.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Active Games" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No active games.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Create a new quiz or host a game.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
