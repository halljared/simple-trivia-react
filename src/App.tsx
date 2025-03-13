import {
  RouterProvider,
  createRootRoute,
  createRoute,
  Router,
} from '@tanstack/react-router';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import EventConfig from '@/pages/EventConfig';

// Create a root route
const rootRoute = createRootRoute({
  component: MainLayout,
});

// Create routes for each page
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const createQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: () => <EventConfig />,
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

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  createQuizRoute,
  hostRoute,
  quizzesRoute,
  settingsRoute,
]);

// Create the router
const router = new Router({ routeTree });

// Register router types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
