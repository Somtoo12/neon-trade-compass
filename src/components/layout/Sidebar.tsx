
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Book, Clock, Gauge, LineChart, PieChart, Scale, Calculator, Compass, GamepadIcon, CalendarDays, ClipboardCheck, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  collapsed = false,
  toggleCollapsed
}) => {
  const navItems: NavItem[] = [
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" />, path: '/forex-calculator' },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" />, path: '/risk-management' },
    { id: 'max-lot-size', label: 'Max Lot Size', icon: <Calculator className="h-5 w-5" />, path: '/max-lot-size' },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" />, path: '/trade-journal' },
    { id: 'challenge-blueprint', label: 'Challenge Blueprint', icon: <ClipboardCheck className="h-5 w-5" />, path: '/challenge-blueprint' },
    { id: 'daily-trade-tools', label: 'Daily Trade Tools', icon: <Compass className="h-5 w-5" />, path: '/daily-trade-tools' },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" />, path: '/session-clock' },
    { id: 'economic-calendar', label: 'Economic Calendar', icon: <CalendarDays className="h-5 w-5" />, path: '/economic-calendar' },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" />, path: '/futures-calculator' },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" />, path: '/crypto-calculator' },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" />, path: '/currency-heatmap' },
    { id: 'trader-games', label: 'Trader Game Center', icon: <GamepadIcon className="h-5 w-5" />, path: '/trader-games' },
  ];

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

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
          {navItems.map((item) => (
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
