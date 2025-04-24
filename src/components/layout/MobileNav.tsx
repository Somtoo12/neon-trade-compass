
import React, { useState } from 'react';
import { BarChart, Book, Clock, Gauge, LineChart, Menu, PieChart, Scale, X } from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';

interface MobileNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'forex-calculator', label: 'Forex Calculator', icon: <BarChart className="h-5 w-5" /> },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" /> },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" /> },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" /> },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" /> },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" /> },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" /> },
  ];

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border/40 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-secondary"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16">
          <nav className="container px-4 py-6">
            <ul className="space-y-4"> {/* Increased space between nav items */}
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-lg transition-all duration-300 text-left ${
                      activeSection === item.id
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    <span className="text-base ml-3">{item.label}</span> {/* Added margin to separate icon and text */}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <div className="pt-16 pb-4 bg-background overflow-y-auto">
        {/* Content will be injected by the AppLayout component */}
      </div>
    </>
  );
};

export default MobileNav;

