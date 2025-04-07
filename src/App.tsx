import { RouterProvider, createRouter } from '@tanstack/react-router';
import { AuthProvider } from '@/providers/AuthProvider';
import { routeTree } from '@/config/routes';
import NotFound from '@/components/NotFound';

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
