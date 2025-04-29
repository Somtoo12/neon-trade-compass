
import { 
  Calculator, BarChart2, LineChart, Calendar, 
  Book, BookOpen, Award, Compass, Clock, 
  TrendingUp, Gamepad, Lightbulb, BarChartIcon,
  Scale, ClipboardCheck
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
  stats: string;
  colorFrom: string;
  colorTo: string;
  isExternal?: boolean;
}

export const toolsData: Tool[] = [
  {
    id: 'forex-calculator',
    name: 'Forex Calculator',
    description: 'Calculate pip values, position sizes, and potential profits for forex trades',
    category: 'Calculators',
    icon: Calculator,
    path: '/forex-calculator',
    stats: '5,200+ monthly calculations',
    colorFrom: 'blue',
    colorTo: 'purple'
  },
  {
    id: 'crypto-calculator',
    name: 'Crypto Calculator',
    description: 'Determine optimal position sizes and risk levels for cryptocurrency trades',
    category: 'Calculators',
    icon: Calculator,
    path: '/crypto-calculator',
    stats: '3,100+ monthly calculations',
    colorFrom: 'green',
    colorTo: 'blue'
  },
  {
    id: 'futures-calculator',
    name: 'Futures Calculator',
    description: 'Calculate position sizes, margin requirements, and risk for futures contracts',
    category: 'Calculators',
    icon: Calculator,
    path: '/futures-calculator', 
    stats: '2,800+ monthly calculations',
    colorFrom: 'purple',
    colorTo: 'green'
  },
  {
    id: 'max-lot-size',
    name: 'Max Lot Size Calculator',
    description: 'Calculate optimal position sizes based on account equity and risk tolerance',
    category: 'Calculators',
    icon: Scale,
    path: '/max-lot-size',
    badge: '🔥 Most Used',
    stats: '2,500+ daily calculations',
    colorFrom: 'green',
    colorTo: 'blue'
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    description: 'Advanced profit, loss, and risk ratio calculator for optimizing trade parameters',
    category: 'Calculators',
    icon: BarChart2,
    path: '/risk-management',
    stats: '1,900+ monthly calculations',
    colorFrom: 'purple',
    colorTo: 'green'
  },
  {
    id: 'session-clock',
    name: 'Session Clock',
    description: 'Real-time display of major forex market sessions with active markets indicator',
    category: 'Market Tools',
    icon: Clock,
    path: '/session-clock',
    stats: '1,700+ monthly views',
    colorFrom: 'blue',
    colorTo: 'green'
  },
  {
    id: 'currency-heatmap',
    name: 'Currency Heatmap',
    description: 'Visual representation of currency strength and weakness across major pairs',
    category: 'Market Tools',
    icon: TrendingUp,
    path: '/currency-heatmap',
    stats: '1,400+ monthly views',
    colorFrom: 'green',
    colorTo: 'purple'
  },
  {
    id: 'trade-journal',
    name: 'Trade Journal',
    description: 'Track your trades and analyze performance patterns to improve profitability',
    category: 'Journals',
    icon: BookOpen,
    path: '/trade-journal',
    badge: '🧠 Smart',
    stats: 'Improves win rate by 28%',
    colorFrom: 'blue',
    colorTo: 'purple'
  },
  {
    id: 'daily-trade-tools',
    name: 'Daily Trading Checklist',
    description: 'Pre-market and post-market checklists to maintain trading discipline',
    category: 'Journals',
    icon: Book,
    path: '/daily-trade-tools',
    stats: 'Used by 750+ traders daily',
    colorFrom: 'purple',
    colorTo: 'blue'
  },
  {
    id: 'challenge-blueprint',
    name: 'Challenge Blueprint',
    description: 'Strategic planner to help you pass prop firm challenges with confidence',
    category: 'Prop Firms',
    icon: ClipboardCheck,
    path: '/challenge-blueprint',
    badge: '💥 Trending',
    stats: '89% success rate',
    colorFrom: 'purple',
    colorTo: 'green'
  },
  {
    id: 'economic-calendar',
    name: 'Economic Calendar',
    description: 'Comprehensive calendar of economic events and data releases affecting markets',
    category: 'Market Tools',
    icon: Calendar,
    path: '/economic-calendar',
    stats: '2,100+ monthly views',
    colorFrom: 'green',
    colorTo: 'blue'
  },
  {
    id: 'trader-games',
    name: 'Trader Games',
    description: 'Educational games to sharpen trading skills, pattern recognition, and reflexes',
    category: 'Games',
    icon: Gamepad,
    path: '/trader-games',
    badge: '🎮 Fun',
    stats: '15+ minutes avg. session',
    colorFrom: 'blue',
    colorTo: 'purple'
  },
];
