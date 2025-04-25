
import React, { useState, useEffect } from 'react';
import { BarChart, Book, Clock, Gauge, LineChart, Menu, PieChart, Scale, Compass, X, GamepadIcon, CalendarDays, ClipboardCheck } from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { id: 'daily-trade-tools', label: '🧭 Daily Trade Tools', icon: <Compass className="h-5 w-5" />, path: '/daily-trade-tools' },
    { id: 'challenge-blueprint', label: 'Challenge Blueprint', icon: <ClipboardCheck className="h-5 w-5" />, path: '/challenge-blueprint' },
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" />, path: '/forex-calculator' },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" />, path: '/crypto-calculator' },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" />, path: '/futures-calculator' },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" />, path: '/session-clock' },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" />, path: '/currency-heatmap' },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" />, path: '/risk-management' },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" />, path: '/trade-journal' },
    { id: 'economic-calendar', label: 'Economic Calendar', icon: <CalendarDays className="h-5 w-5" />, path: '/economic-calendar' },
    { id: 'trader-games', label: '🎮 Trader Game Center', icon: <GamepadIcon className="h-5 w-5" />, path: '/trader-games' },
  ];

  // Handle scroll events for sticky header behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false); // Close the menu when a section is selected
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border/40 shadow-lg transition-all duration-300 ${isScrolled ? 'bg-background/95' : 'bg-background/80'}`}>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-secondary min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-20 overflow-y-auto">
          <nav className="container px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all duration-300 min-h-[48px] ${
                      activeSection === item.id
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                    }`}
                    aria-selected={activeSection === item.id}
                  >
                    {item.icon}
                    <span className="text-base">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
