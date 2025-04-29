
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <button
      onClick={toggleTheme}
      className={`
        transition-all duration-300 ease-in-out
        p-2 rounded-full min-h-[40px] min-w-[40px]
        ${theme === 'dark' 
          ? 'bg-secondary hover:bg-secondary/80 text-primary' 
          : 'bg-white hover:bg-gray-100 text-gray-800 shadow-md'
        }
        ${isMobile ? 'min-h-[44px] min-w-[44px]' : ''}
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
