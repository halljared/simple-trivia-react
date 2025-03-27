import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import EventConfig from '@/pages/EventConfig';
import QuestionEditor from '@/pages/QuestionEditor';
import { Box, Typography, Button } from '@mui/material';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';

function NotFound() {
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

// Create a root route
const rootRoute = createRootRoute({
  component: MainLayout,
  notFoundComponent: NotFound,
});

// Create routes for each page
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const createQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: EventConfig,
});

const hostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/host',
  component: () => <div className="p-4">Host Game Content</div>,
});

const quizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: () => <div className="p-4">My Quizzes Content</div>,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <div className="p-4">Settings Content</div>,
});

const questionEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId/rounds/$roundId',
  validateSearch: () => ({}),
  parseParams: (params: Record<string, string>) => ({
    eventId: params.eventId,
    roundId: params.roundId,
  }),
  stringifyParams: (params: { eventId: string; roundId: string }) => params,
  component: QuestionEditor,
});

export { questionEditorRoute, createQuizRoute };

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  createQuizRoute,
  hostRoute,
  quizzesRoute,
  settingsRoute,
  questionEditorRoute,
]);

// Create the router
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFound,
});

// Register router types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
