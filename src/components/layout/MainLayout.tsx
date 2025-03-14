import { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import { Box, CssBaseline } from '@mui/material';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CssBaseline />
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Height of the AppBar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
