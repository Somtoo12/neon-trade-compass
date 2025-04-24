
import React, { useState } from 'react';
import { BarChart, Book, Calendar, Clock, Flag, Gauge, LineChart, Menu, PieChart, Scale, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
  const [open, setOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'forex-calculator', label: 'Forex Pip Calculator', icon: <BarChart className="h-5 w-5" /> },
    { id: 'crypto-calculator', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" /> },
    { id: 'futures-calculator', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" /> },
    { id: 'session-clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" /> },
    { id: 'currency-heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" /> },
    { id: 'economic-calendar', label: 'Economic Calendar', icon: <Calendar className="h-5 w-5" /> },
    { id: 'risk-management', label: 'Risk Management', icon: <Scale className="h-5 w-5" /> },
    { id: 'trade-journal', label: 'Trade Journal', icon: <Book className="h-5 w-5" /> },
  ];

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    setOpen(false);
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
                      PipCraft
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                </div>
                <nav className="flex-1 overflow-auto py-2">
                  <ul className="space-y-2 px-2">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavigation(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                            activeSection === item.id
                              ? 'bg-accent/20 text-accent neon-border'
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
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft
          </h1>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
