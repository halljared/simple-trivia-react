import { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-background min-h-screen">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={`flex-1 p-6 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
