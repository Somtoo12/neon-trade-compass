
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BarChart, Clock, Gauge, LineChart, PieChart, Scale } from 'lucide-react';
import ForexCalculator from '@/components/calculators/ForexCalculator';
import CryptoCalculator from '@/components/calculators/CryptoCalculator';
import FuturesCalculator from '@/components/calculators/FuturesCalculator';
import SessionClock from '@/components/tools/SessionClock';
import CurrencyHeatmap from '@/components/tools/CurrencyHeatmap';
import RiskManagement from '@/components/tools/RiskManagement';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme/ThemeToggle';

const Calculators: React.FC = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('forex');
  
  // Handle hash changes for deep linking
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      // Scroll to section
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const sections = [
    { id: 'forex', label: 'Forex Calculator', icon: <BarChart className="h-5 w-5" /> },
    { id: 'crypto', label: 'Crypto Calculator', icon: <LineChart className="h-5 w-5" /> },
    { id: 'futures', label: 'Futures Calculator', icon: <PieChart className="h-5 w-5" /> },
    { id: 'clock', label: 'Session Clock', icon: <Clock className="h-5 w-5" /> },
    { id: 'heatmap', label: 'Currency Heatmap', icon: <Gauge className="h-5 w-5" /> },
    { id: 'risk', label: 'Risk Management', icon: <Scale className="h-5 w-5" /> },
  ];

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'forex':
        return <ForexCalculator />;
      case 'crypto':
        return <CryptoCalculator />;
      case 'futures':
        return <FuturesCalculator />;
      case 'clock':
        return <SessionClock />;
      case 'heatmap':
        return <CurrencyHeatmap />;
      case 'risk':
        return <RiskManagement />;
      default:
        return <ForexCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10 py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="font-bold text-lg md:text-xl font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft Tools
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <nav className="flex overflow-x-auto pb-3 mb-6 hide-scrollbar">
          <div className="flex space-x-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-accent/20 text-accent neon-border'
                    : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                }`}
              >
                {section.icon}
                <span>{section.label}</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-8">
          {sections.map((section) => (
            <section 
              key={section.id} 
              id={section.id}
              className={`scroll-mt-24 py-8 ${activeSection === section.id ? 'animate-fade-in' : ''}`}
            >
              <h2 className="text-2xl font-bold mb-6 font-poppins">{section.label}</h2>
              {renderSection(section.id)}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculators;
