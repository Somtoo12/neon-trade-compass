
import React from 'react';
import { BarChart, Book, Clock, Gauge, LineChart, PieChart, Scale, Compass, GamepadIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navItems: NavItem[] = [
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" />, path: '/forex-calculator' },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" />, path: '/crypto-calculator' },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" />, path: '/futures-calculator' },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" />, path: '/session-clock' },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" />, path: '/currency-heatmap' },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" />, path: '/risk-management' },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" />, path: '/trade-journal' },
    { id: 'daily-trade-tools', label: '🧭 Daily Trade Tools', icon: <Compass className="h-5 w-5" />, path: '/daily-trade-tools' },
    { 
      id: 'trader-games', 
      label: '🎮 Trader Game Center', 
      icon: <GamepadIcon className="h-5 w-5" />, 
      path: '/trader-games' 
    },
  ];

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="w-64 lg:w-72 h-screen sticky top-0 glassmorphism overflow-y-auto p-4 border-r border-border/30">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
          PipCraft
        </h1>
        <div className="text-xs text-center text-muted-foreground mt-1">
          Smart Tools. No Noise.
        </div>
      </div>
      
      <nav>
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
                }`}
                aria-selected={activeSection === item.id}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
