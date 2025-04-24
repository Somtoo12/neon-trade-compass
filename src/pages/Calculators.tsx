
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ForexCalculator from '@/components/calculators/ForexCalculator';
import CryptoCalculator from '@/components/calculators/CryptoCalculator';
import FuturesCalculator from '@/components/calculators/FuturesCalculator';
import TradeJournal from '@/components/calculators/TradeJournal';

const Calculators: React.FC = () => {
  const [activeSection, setActiveSection] = useState('trade-journal');

  const renderSection = () => {
    switch (activeSection) {
      case 'forex-calculator':
        return <ForexCalculator />;
      case 'crypto-calculator':
        return <CryptoCalculator />;
      case 'futures-calculator':
        return <FuturesCalculator />;
      case 'trade-journal':
        return <TradeJournal />;
      default:
        return <TradeJournal />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft Calculators
          </h1>
          <p className="text-muted-foreground">
            Smart tools to enhance your trading decisions. No noise. No API. Pure calculation.
          </p>
        </div>

        {renderSection()}
      </div>
    </AppLayout>
  );
};

export default Calculators;
