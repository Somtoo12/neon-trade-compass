
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Book, Clock, Gauge, LineChart, PieChart, Scale, Calculator, 
  Compass, GamepadIcon, CalendarDays, ClipboardCheck, ChevronLeft, 
  ChevronRight, QrCode, Timer, FileText, Sliders, Calendar, Dice6,
  ShieldCheck, ListOrdered, Binary, Award, Palette, Droplet, RotateCw,
  User, ArrowUpDown, Keyboard, Key, ShieldLock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed?: boolean;
  toggleCollapsed?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  category?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  collapsed = false,
  toggleCollapsed
}) => {
  const navItems: NavItem[] = [
    // Trading Tools
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" />, path: '/forex-calculator', category: 'Trading' },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" />, path: '/risk-management', category: 'Trading' },
    { id: 'max-lot-size', label: 'Max Lot Size', icon: <Calculator className="h-5 w-5" />, path: '/max-lot-size', category: 'Trading' },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" />, path: '/trade-journal', category: 'Trading' },
    { id: 'challenge-blueprint', label: 'Challenge Blueprint', icon: <ClipboardCheck className="h-5 w-5" />, path: '/challenge-blueprint', category: 'Trading' },
    { id: 'daily-trade-tools', label: 'Daily Trade Tools', icon: <Compass className="h-5 w-5" />, path: '/daily-trade-tools', category: 'Trading' },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" />, path: '/session-clock', category: 'Trading' },
    { id: 'economic-calendar', label: 'Economic Calendar', icon: <CalendarDays className="h-5 w-5" />, path: '/economic-calendar', category: 'Trading' },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" />, path: '/futures-calculator', category: 'Trading' },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" />, path: '/crypto-calculator', category: 'Trading' },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" />, path: '/currency-heatmap', category: 'Trading' },
    { id: 'trader-games', label: 'Trader Game Center', icon: <GamepadIcon className="h-5 w-5" />, path: '/trader-games', category: 'Trading' },
    { id: 'admin', label: 'Admin Control Panel', icon: <ShieldLock className="h-5 w-5" />, path: '/admin', category: 'Admin' },
    
    // Utility Tools
    { id: 'qr-code-generator', label: 'QR Code Generator', icon: <QrCode className="h-5 w-5" />, path: '/qr-code-generator', category: 'Utilities' },
    { id: 'countdown-timer', label: 'Countdown Timer', icon: <Timer className="h-5 w-5" />, path: '/countdown-timer', category: 'Utilities' },
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
    { id: 'password-generator', label: 'Password Generator', icon: <Key className="h-5 w-5" />, path: '/password-generator', category: 'Utilities' },
  ];

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  // Group items by category
  const tradingTools = navItems.filter(item => item.category === 'Trading' || !item.category);
  const utilityTools = navItems.filter(item => item.category === 'Utilities');
  const adminTools = navItems.filter(item => item.category === 'Admin');

  return (
    <div className={`h-screen sticky top-0 glassmorphism overflow-y-auto transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64 lg:w-72'
    } border-r border-border/30`}>
      <div className="relative">
        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 rounded-full p-1 h-6 w-6"
          onClick={toggleCollapsed}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>
      
      <div className={`mb-8 p-4 ${collapsed ? 'text-center' : ''}`}>
        <Link to="/" className="block text-center">
          <h1 className={`text-2xl font-bold font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent ${
            collapsed ? 'text-xl' : ''
          }`}>
            {collapsed ? 'PC' : 'PipCraft'}
          </h1>
        </Link>
        {!collapsed && (
          <div className="text-xs text-center text-muted-foreground mt-1">
            Smart Tools. No Noise.
          </div>
        )}
      </div>
      
      <nav className="px-2">
        <ul className="space-y-1.5">
          {/* Admin Section */}
          {!collapsed && adminTools.length > 0 && (
            <li className="px-3 py-2">
              <h2 className="text-xs font-semibold text-muted-foreground">Admin</h2>
            </li>
          )}
          {adminTools.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-accent/20 text-accent neon-border neon-purple-glow'
                    : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
                aria-selected={activeSection === item.id}
              >
                {item.icon}
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}

          {/* Trading Tools Section */}
          {!collapsed && (
            <li className="px-3 py-2">
              <h2 className="text-xs font-semibold text-muted-foreground">Trading Tools</h2>
            </li>
          )}
          {tradingTools.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-accent/20 text-accent neon-border neon-purple-glow'
                    : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
                aria-selected={activeSection === item.id}
              >
                {item.icon}
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}

          {/* Utility Tools Section */}
          {!collapsed && utilityTools.length > 0 && (
            <li className="px-3 py-2 mt-4">
              <h2 className="text-xs font-semibold text-muted-foreground">Utility Tools</h2>
            </li>
          )}
          {utilityTools.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-accent/20 text-accent neon-border neon-purple-glow'
                    : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
                aria-selected={activeSection === item.id}
              >
                {item.icon}
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
