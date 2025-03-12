import { Menu, User } from 'lucide-react';
import { Button } from '../ui/button';

interface TopNavProps {
  onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 h-16 border-b backdrop-blur">
      <div className="flex h-full items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="mr-4"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex-1">
          <h1 className="text-xl font-bold">Trivia Builder</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
