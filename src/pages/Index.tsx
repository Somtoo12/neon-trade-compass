
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ForexCalculator from '@/components/calculators/ForexCalculator';
import CryptoCalculator from '@/components/calculators/CryptoCalculator';
import FuturesCalculator from '@/components/calculators/FuturesCalculator';
import SessionClock from '@/components/tools/SessionClock';
import CurrencyHeatmap from '@/components/tools/CurrencyHeatmap';
import RiskManagement from '@/components/tools/RiskManagement';
import TradeJournal from '@/components/calculators/TradeJournal';
import DailyTradeTools from '@/components/tools/DailyTradeTools';
import TraderGameCenter from '@/components/games/TraderGameCenter';
import { useNavigate } from 'react-router-dom';

interface IndexProps {
  activeSection: string;
}

const Index: React.FC<IndexProps> = ({ activeSection }) => {
  const navigate = useNavigate();
  
  const setActiveSection = (section: string) => {
    navigate(`/${section}`);
  };

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
      case 'daily-trade-tools':
        return <DailyTradeTools />;
      case 'trader-games':
        return <TraderGameCenter />;
      default:
        return <ForexCalculator />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="container mx-auto max-w-6xl px-2 sm:px-4">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft Trading Tools
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Smart tools to enhance your trading decisions. No noise. No API. Pure calculation.
          </p>
        </div>

        {renderSection()}
      </div>
    </AppLayout>
  );
};

export default Index;
