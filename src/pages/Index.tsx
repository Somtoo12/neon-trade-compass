
import React, { useEffect } from 'react';
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
import SEO from '@/components/shared/SEO';
import useToolBlogPost from '@/hooks/useToolBlogPost';

interface IndexProps {
  activeSection: string;
}

const Index: React.FC<IndexProps> = ({ activeSection }) => {
  const navigate = useNavigate();
  const { blogPostSection } = useToolBlogPost(activeSection);
  
  const setActiveSection = (section: string) => {
    navigate(`/${section}`);
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
      case 'session-clock':
        return {
          title: "Session Clock | Forex Market Hours Tool | PipCraft",
          description: "Track forex market sessions in real-time with our intuitive session clock tool.",
          keywords: "forex market hours tool, trading session clock"
        };
      case 'currency-heatmap':
        return {
          title: "Currency Heatmap | Currency Strength Visualizer | PipCraft",
          description: "Visualize currency strength relationships across major and minor forex pairs.",
          keywords: "currency strength heatmap, forex pair strength tool"
        };
      case 'risk-management':
        return {
          title: "Risk Management | Trading Position Size Calculator | PipCraft",
          description: "Optimize your trading risk with our comprehensive risk management tools.",
          keywords: "trading risk management tool, position size calculator"
        };
      case 'trade-journal':
        return {
          title: "Trade Journal | Trading Performance Tracker | PipCraft",
          description: "Log and analyze your trading history with our comprehensive trade journal.",
          keywords: "trading journal online, trade performance tracker"
        };
      case 'daily-trade-tools':
        return {
          title: "Daily Trade Tools | Essential Trading Utilities | PipCraft",
          description: "Essential tools for day-to-day trading activities and performance tracking.",
          keywords: "daily trading tools, trader utilities"
        };
      case 'trader-games':
        return {
          title: "Trader Games | Interactive Trading Skills Practice | PipCraft",
          description: "Improve your trading skills with interactive games and challenges.",
          keywords: "trading practice games, trader skill building"
        };
      case 'challenge-blueprint':
        return {
          title: "Challenge Blueprint | Prop Firm Challenge Planner | PipCraft",
          description: "Plan and track your prop firm challenge progress with our strategic blueprint tool.",
          keywords: "prop firm challenge planner, trading challenge blueprint"
        };
      case 'economic-calendar':
        return {
          title: "Economic Calendar | Market-Moving Events Tracker | PipCraft",
          description: "Stay updated with important economic events that impact the markets.",
          keywords: "forex economic calendar, market events tracker"
        };
      default:
        return {
          title: "PipCraft | Trading Tools for Forex, Crypto and Futures Traders",
          description: "All-in-one trading tools: pip calculators, risk management, journals, and more. Built for ambitious traders.",
          keywords: "trading tools, pip calculator, risk management"
        };
    }
  };

  const metaData = getMetaData();

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
      <SEO
        title={metaData.title}
        description={metaData.description}
        keywords={metaData.keywords}
      />
      <div className="container mx-auto max-w-6xl px-2 sm:px-4">
        {renderSection()}
        {blogPostSection}
      </div>
    </AppLayout>
  );
};

export default Index;
