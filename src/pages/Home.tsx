// Home/Login page

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '../stores/userStore';
import { useNavigate } from '@tanstack/react-router';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, register, isLoading, isAuthenticated } = useAuthStore();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (tabValue === 0) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Trivia!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="auth tabs"
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            <TabPanel value={tabValue} index={0}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </TabPanel>

            {error && (
              <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ minWidth: 200 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : tabValue === 0 ? (
                  'Login'
                ) : (
                  'Register'
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
