
import React, { useState, useEffect } from 'react';
import { BarChart, Book, Clock, Gauge, LineChart, Menu, PieChart, Scale, Compass, X, GamepadIcon, CalendarDays, ClipboardCheck, QrCode, Timer, FileText, Calculator, Calendar, Dice6, ShieldCheck, ListOrdered, Binary, Award, Palette, Droplet, RotateCw, User, ArrowUpDown, Keyboard, Key } from 'lucide-react';
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
  category?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    // Trading Tools
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" />, path: '/forex-calculator', category: 'Trading' },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" />, path: '/risk-management', category: 'Trading' },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" />, path: '/trade-journal', category: 'Trading' },
    { id: 'challenge-blueprint', label: 'Challenge Blueprint', icon: <ClipboardCheck className="h-5 w-5" />, path: '/challenge-blueprint', category: 'Trading' },
    { id: 'daily-trade-tools', label: 'Daily Trade Tools', icon: <Compass className="h-5 w-5" />, path: '/daily-trade-tools', category: 'Trading' },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" />, path: '/session-clock', category: 'Trading' },
    { id: 'economic-calendar', label: 'Economic Calendar', icon: <CalendarDays className="h-5 w-5" />, path: '/economic-calendar', category: 'Trading' },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" />, path: '/futures-calculator', category: 'Trading' },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" />, path: '/crypto-calculator', category: 'Trading' },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" />, path: '/currency-heatmap', category: 'Trading' },
    { id: 'trader-games', label: 'Trader Game Center', icon: <GamepadIcon className="h-5 w-5" />, path: '/trader-games', category: 'Trading' },
    
    // Utility Tools
    { id: 'qr-code-generator', label: 'QR Code Generator', icon: <QrCode className="h-5 w-5" />, path: '/qr-code-generator', category: 'Utilities' },
    { id: 'countdown-timer', label: 'Countdown Timer', icon: <Clock className="h-5 w-5" />, path: '/countdown-timer', category: 'Utilities' },
    { id: 'character-counter', label: 'Character Counter', icon: <FileText className="h-5 w-5" />, path: '/character-counter', category: 'Utilities' },
    { id: 'tip-calculator', label: 'Tip Calculator', icon: <Calculator className="h-5 w-5" />, path: '/tip-calculator', category: 'Utilities' },
    { id: 'date-calculator', label: 'Date Calculator', icon: <Calendar className="h-5 w-5" />, path: '/date-calculator', category: 'Utilities' },
    { id: 'random-generator', label: 'Random Generator', icon: <Dice6 className="h-5 w-5" />, path: '/random-generator', category: 'Utilities' },
    { id: 'password-strength-checker', label: 'Password Checker', icon: <ShieldCheck className="h-5 w-5" />, path: '/password-strength-checker', category: 'Utilities' },
    { id: 'number-to-words-converter', label: 'Number to Words', icon: <ListOrdered className="h-5 w-5" />, path: '/number-to-words-converter', category: 'Utilities' },
    { id: 'binary-to-decimal-converter', label: 'Binary Converter', icon: <Binary className="h-5 w-5" />, path: '/binary-to-decimal-converter', category: 'Utilities' },
    { id: 'grade-calculator', label: 'Grade Calculator', icon: <Award className="h-5 w-5" />, path: '/grade-calculator', category: 'Utilities' },
    { id: 'hex-to-rgb-converter', label: 'Color Converter', icon: <Palette className="h-5 w-5" />, path: '/hex-to-rgb-converter', category: 'Utilities' },
    { id: 'daily-water-intake-calculator', label: 'Water Intake', icon: <Droplet className="h-5 w-5" />, path: '/daily-water-intake-calculator', category: 'Utilities' },
    { id: 'text-reverser', label: 'Text Reverser', icon: <RotateCw className="h-5 w-5" />, path: '/text-reverser', category: 'Utilities' },
    { id: 'username-generator', label: 'Username Generator', icon: <User className="h-5 w-5" />, path: '/username-generator', category: 'Utilities' },
    { id: 'miles-to-km-converter', label: 'Unit Converter', icon: <ArrowUpDown className="h-5 w-5" />, path: '/miles-to-km-converter', category: 'Utilities' },
    { id: 'typing-speed-tester', label: 'Typing Speed Test', icon: <Keyboard className="h-5 w-5" />, path: '/typing-speed-tester', category: 'Utilities' },
    { id: 'password-generator', label: 'Password Generator', icon: <Key className="h-5 w-5" />, path: '/password-generator', category: 'Utilities' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false);
  };

  // Group items by category for the mobile view
  const tradingTools = navItems.filter(item => item.category === 'Trading' || !item.category);
  const utilityTools = navItems.filter(item => item.category === 'Utilities');

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border/40 shadow-lg transition-all duration-300 ${isScrolled ? 'bg-background/95' : 'bg-background/80'}`}>
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="text-xl font-bold font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft
          </Link>
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
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-20 pb-safe overflow-y-auto">
          <nav className="container px-4 py-6">
            {/* Trading Tools Section */}
            <h3 className="font-medium text-sm text-muted-foreground px-4 py-2">Trading Tools</h3>
            <ul className="space-y-2 mb-6">
              {tradingTools.map((item) => (
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
            
            {/* Utility Tools Section */}
            <h3 className="font-medium text-sm text-muted-foreground px-4 py-2">Utility Tools</h3>
            <ul className="space-y-2">
              {utilityTools.map((item) => (
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
