
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <button
      onClick={toggleTheme}
      className={`
        transition-all duration-300 ease-in-out
        p-2 rounded-full
        ${theme === 'dark' 
          ? 'bg-secondary hover:bg-secondary/80 text-primary' 
          : 'bg-white hover:bg-gray-100 text-gray-800 shadow-md'
        }
        ${isMobile && !className ? '' : className || 'fixed top-4 right-4 z-50'}
      `}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
