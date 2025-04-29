import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, GamepadIcon, BookOpen, Compass, Menu, X, Calendar, Home
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const AppHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { label: 'Home', icon: <Home className="h-4 w-4" />, path: '/' },
    { label: 'Calculators', icon: <Calculator className="h-4 w-4" />, path: '/calculators' },
    { label: 'Journal', icon: <BookOpen className="h-4 w-4" />, path: '/trade-journal' },
    { label: 'Games', icon: <GamepadIcon className="h-4 w-4" />, path: '/trader-games' },
    { label: 'Calendar', icon: <Calendar className="h-4 w-4" />, path: '/daily-trade-tools' },
    { label: 'Tools', icon: <Compass className="h-4 w-4" />, path: '/tools' },
  ];
  
  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-background/80 shadow-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <Link to="/" className="font-bold text-lg md:text-xl bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              PipCraft
            </Link>
          </div>
          
          {isMobile ? (
            <div className="flex items-center gap-2 self-end">
              <ThemeToggle />
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <nav className="flex gap-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.label}
                    to={item.path}
                    className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/10 min-h-[40px]"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          )}
        </div>
      </motion.header>
      
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-16 overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="container mx-auto p-4">
              <nav className="flex flex-col gap-3 pb-safe">
                {navItems.map((item) => (
                  <Link 
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-base p-4 rounded-md border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-colors min-h-[44px]"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppHeader;
