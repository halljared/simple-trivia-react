import { Outlet } from '@tanstack/react-router';
import { EventProvider } from '@/providers/EventProvider';

function EventLayout() {
  return (
    <EventProvider>
      <Outlet />
    </EventProvider>
  );
}

export default EventLayout;
