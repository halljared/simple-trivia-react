import { createRootRoute, createRoute } from '@tanstack/react-router';
import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import RoundEditor from '@/pages/RoundEditor';
import Dashboard from '@/pages/Dashboard';
import EventLayout from '@/components/layout/EventLayout';
import NotFound from '@/components/NotFound';
import EventList from '@/pages/EventList';
import EventCreate from '@/pages/events/EventCreate';
import EventEdit from '@/pages/events/EventEdit';

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

// Event layout route
const eventLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventLayout,
});

const createQuizRoute = createRoute({
  getParentRoute: () => eventLayoutRoute,
  path: '/create',
  component: EventCreate,
});

const editQuizRoute = createRoute({
  getParentRoute: () => eventLayoutRoute,
  path: '$eventId/edit',
  validateSearch: () => ({}),
  parseParams: (params: Record<string, string>) => ({
    eventId: params.eventId,
  }),
  stringifyParams: (params: { eventId: string }) => params,
  component: EventEdit,
});

const roundEditorRoute = createRoute({
  getParentRoute: () => eventLayoutRoute,
  path: '$eventId/rounds/$roundId',
  validateSearch: () => ({}),
  parseParams: (params: Record<string, string>) => ({
    eventId: params.eventId,
    roundId: params.roundId,
  }),
  stringifyParams: (params: { eventId: string; roundId: string }) => params,
  component: RoundEditor,
});

const eventListRoute = createRoute({
  getParentRoute: () => eventLayoutRoute,
  path: '/list',
  component: EventList,
});

export {
  rootRoute,
  indexRoute,
  dashboardRoute,
  createQuizRoute,
  roundEditorRoute,
  eventLayoutRoute,
  eventListRoute,
  editQuizRoute,
};

export const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  createQuizRoute,
  eventLayoutRoute.addChildren([
    createQuizRoute,
    editQuizRoute,
    eventListRoute,
    roundEditorRoute,
  ]),
]);
