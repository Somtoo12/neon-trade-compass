
import React, { useState } from 'react';
import { BarChart, Book, Clock, Gauge, LineChart, Menu, PieChart, Scale, Compass, X } from 'lucide-react';
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
  const location = useLocation();

  const navItems: NavItem[] = [
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" />, path: '/forex-calculator' },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" />, path: '/crypto-calculator' },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" />, path: '/futures-calculator' },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" />, path: '/session-clock' },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" />, path: '/currency-heatmap' },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" />, path: '/risk-management' },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" />, path: '/trade-journal' },
    { id: 'daily-trade-tools', label: '🧭 Daily Trade Tools', icon: <Compass className="h-5 w-5" />, path: '/daily-trade-tools' },
  ];

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsOpen(false); // Close the menu when a section is selected
  };

  return (
    <>
      <div className="sticky top-0 z-50 glassmorphism border-b border-border/40 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-secondary"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16 overflow-y-auto">
          <nav className="container px-4 py-6">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                    }`}
                    aria-selected={activeSection === item.id}
                  >
                    {item.icon}
                    <span>{item.label}</span>
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
