import { Home, PlusCircle, PlayCircle, Settings, Library } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: PlusCircle, label: 'Create Quiz', path: '/create' },
    { icon: PlayCircle, label: 'Host Game', path: '/host' },
    { icon: Library, label: 'My Quizzes', path: '/quizzes' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside
      className={`bg-background fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 border-r transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
