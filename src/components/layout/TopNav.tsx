import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Popover,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthStore } from '../../stores/userStore';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface TopNavProps {
  onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: 'text.primary' }}
        >
          Trivia Builder
        </Typography>

        <Box>
          <IconButton
            color="inherit"
            sx={{ color: 'text.primary' }}
            onClick={handleClick}
            aria-label="user menu"
          >
            <AccountCircleIcon />
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
