
import React from 'react';
import { BarChart, Clock, Gauge, LineChart, PieChart, Scale, Calendar } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navItems: NavItem[] = [
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" /> },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" /> },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" /> },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" /> },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" /> },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" /> },
    { id: 'market-calendar', label: 'Market Calendar', icon: <Calendar className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 glassmorphism overflow-y-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
          PipCraft
        </h1>
        <div className="text-xs text-center text-muted-foreground mt-1">
          Smart Tools. No Noise.
        </div>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-accent/20 text-accent neon-border neon-purple-glow'
                    : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
