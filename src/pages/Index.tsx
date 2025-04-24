
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ForexCalculator from '@/components/calculators/ForexCalculator';
import CryptoCalculator from '@/components/calculators/CryptoCalculator';
import FuturesCalculator from '@/components/calculators/FuturesCalculator';
import SessionClock from '@/components/tools/SessionClock';
import CurrencyHeatmap from '@/components/tools/CurrencyHeatmap';
import RiskManagement from '@/components/tools/RiskManagement';
import TradeJournal from '@/components/calculators/TradeJournal';

const Index: React.FC = () => {
  const [activeSection, setActiveSection] = useState('forex-calculator');

  const renderSection = () => {
    switch (activeSection) {
      case 'forex-calculator':
        return <ForexCalculator />;
      case 'crypto-calculator':
        return <CryptoCalculator />;
      case 'futures-calculator':
        return <FuturesCalculator />;
      case 'session-clock':
        return <SessionClock />;
      case 'currency-heatmap':
        return <CurrencyHeatmap />;
      case 'risk-management':
        return <RiskManagement />;
      case 'trade-journal':
        return <TradeJournal />;
      default:
        return <ForexCalculator />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="container mx-auto">
        <div className="mb-4">
          <h1 className="text-xl md:text-3xl font-bold mb-1 font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            {activeSection === 'trade-journal' ? 'Trade Journal Tracker' : 'PipCraft Trading Tools'}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Smart tools to enhance your trading decisions. No noise. No API. Pure calculation.
          </p>
        </div>

        {renderSection()}
      </div>
    </AppLayout>
  );
};

export default Index;
