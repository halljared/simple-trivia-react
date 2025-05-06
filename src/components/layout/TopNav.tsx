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
  const { logout, user } = useAuthStore();
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
            slotProps={{
              paper: {
                sx: {
                  p: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  borderRadius: 2,
                },
                elevation: 4,
              },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  mb: 1,
                  textAlign: 'left',
                  px: 1,
                }}
              >
                Logged in as:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  mb: 1,
                  textAlign: 'center',
                  px: 1,
                }}
              >
                {user?.username}
              </Typography>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  mt: 1,
                  borderRadius: 1,
                  bgcolor: 'grey.100',
                  '&:hover': {
                    bgcolor: 'grey.200',
                  },
                  fontWeight: 500,
                  justifyContent: 'center',
                }}
              >
                Logout
              </MenuItem>
            </Box>
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
