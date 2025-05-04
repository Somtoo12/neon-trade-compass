
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ForexCalculator from '@/components/calculators/ForexCalculator';
import CryptoCalculator from '@/components/calculators/CryptoCalculator';
import FuturesCalculator from '@/components/calculators/FuturesCalculator';
import TradeJournal from '@/components/calculators/TradeJournal';
import SEO from '@/components/shared/SEO';

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

  const getMetaData = () => {
    switch (activeSection) {
      case 'forex-calculator':
        return {
          title: "Forex Pip Calculator | How to Calculate Pips in Forex Trading | PipCraft",
          description: "Use our forex pip calculator for beginners to accurately calculate pip values for different currency pairs. Learn how to calculate pips in forex trading.",
          keywords: "forex pip calculator for beginners, how to calculate pips in forex trading, pip calculator for different currency pairs, forex pip calculator with lot size"
        };
      case 'crypto-calculator':
        return {
          title: "Crypto Calculator | Pip Calculator for Crypto Trading | PipCraft",
          description: "Calculate position sizes and profit/loss for cryptocurrency trades with our pip calculator for crypto trading.",
          keywords: "pip calculator for crypto trading, cryptocurrency position calculator"
        };
      case 'futures-calculator':
        return {
          title: "Futures Calculator | Position Size Calculator for Futures | PipCraft",
          description: "Calculate contract values, margins, and P/L for futures trading with our specialized calculator.",
          keywords: "futures position calculator, futures margin calculator"
        };
      case 'trade-journal':
        return {
          title: "Trade Journal | Trading Performance Tracker | PipCraft",
          description: "Log and analyze your trading history with our comprehensive trade journal for forex, crypto, and futures traders.",
          keywords: "trading journal online, trade performance tracker"
        };
      default:
        return {
          title: "PipCraft Calculators | Trading Tools",
          description: "Smart tools to enhance your trading decisions. Calculate pip values, position sizes, and more.",
          keywords: "forex calculator, crypto calculator, trading tools"
        };
    }
  };

  const metaData = getMetaData();

  return (
    <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <SEO 
        title={metaData.title}
        description={metaData.description}
        keywords={metaData.keywords}
      />
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
