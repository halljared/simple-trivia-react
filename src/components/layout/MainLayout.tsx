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
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Sidebar isOpen={sidebarOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            marginLeft: sidebarOpen ? '256px' : 0,
            width: sidebarOpen ? 'calc(100% - 256px)' : '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
