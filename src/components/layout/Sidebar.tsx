import { Link } from '@tanstack/react-router';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { isAuthenticated } = useAuth();

  const authenticatedNavItems = [
    { icon: HomeIcon, label: 'Dashboard', path: '/' },
    { icon: AddCircleIcon, label: 'Create Event', path: '/create' },
    { icon: LibraryBooksIcon, label: 'My Events', path: '/events' },
    { icon: PlayCircleIcon, label: 'Host Game', path: '/host' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  const unauthenticatedNavItems = [
    { icon: LoginIcon, label: 'Login', path: '/login' },
  ];

  const navItems = isAuthenticated
    ? authenticatedNavItems
    : unauthenticatedNavItems;

  const drawerWidth = 256;
  const transition = '225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms';

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={isOpen}
      sx={{
        width: isOpen ? drawerWidth : 0,
        flexShrink: 0,
        transition: `width ${transition}`,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          transform: isOpen ? 'none' : 'translateX(-256px)',
          transition: `transform ${transition}`,
        },
      }}
    >
      <Box sx={{ mt: 8 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
