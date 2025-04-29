
import {
  Calculator, BookOpen, GamepadIcon, Calendar, Clock, LineChart,
  BarChart2, Compass, BrainCircuit, Heart, Layout, Search, 
  FileText, Sliders, Users, BookText
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
  icon: any;
}

export const toolsData: Tool[] = [
  {
    id: 'forex-calculator',
    name: 'Forex Calculator',
    description: 'Calculate pip values, position sizes, and profit/loss for forex trades',
    path: '/forex-calculator',
    category: 'Calculators',
    icon: Calculator
  },
  {
    id: 'crypto-calculator',
    name: 'Crypto Calculator',
    description: 'Calculate position sizes and profit/loss for cryptocurrency trades',
    path: '/crypto-calculator',
    category: 'Calculators',
    icon: Calculator
  },
  {
    id: 'futures-calculator',
    name: 'Futures Calculator',
    description: 'Calculate contract values, margins, and P/L for futures trading',
    path: '/futures-calculator',
    category: 'Calculators',
    icon: Calculator
  },
  {
    id: 'max-lot-size',
    name: 'Max Lot Size',
    description: 'Find the optimal lot size based on your risk parameters',
    path: '/max-lot-size',
    category: 'Risk Management',
    icon: Sliders
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    description: 'Tools for managing trading risk and position sizing',
    path: '/risk-management',
    category: 'Risk Management',
    icon: LineChart
  },
  {
    id: 'trade-journal',
    name: 'Trade Journal',
    description: 'Log and analyze your trading history',
    path: '/trade-journal',
    category: 'Journal',
    icon: BookOpen
  },
  {
    id: 'session-clock',
    name: 'Session Clock',
    description: 'Track forex market sessions in real-time',
    path: '/session-clock',
    category: 'Market Tools',
    icon: Clock
  },
  {
    id: 'currency-heatmap',
    name: 'Currency Heatmap',
    description: 'Visualize currency strength relationships',
    path: '/currency-heatmap',
    category: 'Market Tools',
    icon: Layout
  },
  {
    id: 'economic-calendar',
    name: 'Economic Calendar',
    description: 'Stay updated with important economic events',
    path: '/economic-calendar',
    category: 'Calendar',
    icon: Calendar
  },
  {
    id: 'daily-trade-tools',
    name: 'Daily Trade Tools',
    description: 'Essential tools for day-to-day trading activities',
    path: '/daily-trade-tools',
    category: 'Market Tools',
    icon: BarChart2
  },
  {
    id: 'challenge-blueprint',
    name: 'Challenge Blueprint',
    description: 'Plan and track your prop firm challenge progress',
    path: '/challenge-blueprint',
    category: 'Strategy',
    icon: BrainCircuit
  },
  {
    id: 'trader-games',
    name: 'Trader Games',
    description: 'Interactive games to improve trading skills',
    path: '/trader-games',
    category: 'Education',
    icon: GamepadIcon
  },
];
