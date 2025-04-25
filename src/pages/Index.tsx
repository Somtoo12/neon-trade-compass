
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
import ChallengeBlueprint from '@/components/tools/ChallengeBlueprint';
import EconomicCalendar from './EconomicCalendar';
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
      case 'challenge-blueprint':
        return <ChallengeBlueprint />;
      case 'economic-calendar':
        return <EconomicCalendar />;
      default:
        return <ForexCalculator />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <div className="container mx-auto max-w-6xl px-2 sm:px-4">
        {renderSection()}
      </div>
    </AppLayout>
  );
};

export default Index;
