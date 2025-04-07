import { Box, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <Typography variant="h2" component="h1">
        404
      </Typography>
      <Typography variant="h5" component="h2">
        Page Not Found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" href="/">
        Go to Home
      </Button>
    </Box>
  );
}
