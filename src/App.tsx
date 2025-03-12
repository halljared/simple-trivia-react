import {
  RouterProvider,
  Router,
  Route,
  RootRoute,
} from '@tanstack/react-router';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

// Create a root route
const rootRoute = new RootRoute({
  component: MainLayout,
});

// Create routes for each page
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const createRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: () => <div className="p-4">Create Quiz Content</div>,
});

const hostRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/host',
  component: () => <div className="p-4">Host Game Content</div>,
});

const quizzesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: () => <div className="p-4">My Quizzes Content</div>,
});

const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <div className="p-4">Settings Content</div>,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  createRoute,
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
