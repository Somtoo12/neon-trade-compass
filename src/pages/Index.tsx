import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ForexCalculator from '@/components/calculators/ForexCalculator';
import CryptoCalculator from '@/components/calculators/CryptoCalculator';
import FuturesCalculator from '@/components/calculators/FuturesCalculator';
import SessionClock from '@/components/tools/SessionClock';
import CurrencyHeatmap from '@/components/tools/CurrencyHeatmap';
import RiskManagement from '@/components/tools/RiskManagement';
import TradeJournal from '@/components/calculators/TradeJournal';
import PropFirmPromos from '@/components/promos/PropFirmPromos';
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
      case 'prop-firm-promos':
        return <PropFirmPromos />;
      default:
        return <ForexCalculator />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </AppLayout>
  );
};

export default Index;
