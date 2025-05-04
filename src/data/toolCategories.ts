
import { 
  Calculator, 
  ClipboardList, 
  BarChart2, 
  Bitcoin, 
  ArrowLeftRight, 
  Gamepad 
} from 'lucide-react';

export const toolCategories = [
  {
    id: 'calculators',
    name: 'Calculators',
    icon: Calculator,
    description: 'Financial and academic calculators',
    examples: [
      { name: 'Pip Calculator', path: '/forex-calculator' },
      { name: 'GPA Calculator', path: '/grade-calculator' },
      { name: 'Max Lot Size', path: '/max-lot-size' }
    ],
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: ClipboardList,
    description: 'Tools to boost your efficiency',
    examples: [
      { name: 'Word Counter', path: '/character-counter' },
      { name: 'Countdown Timer', path: '/countdown-timer' },
      { name: 'Date Calculator', path: '/date-calculator' }
    ],
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-500'
  },
  {
    id: 'trading',
    name: 'Trading Tools',
    icon: BarChart2,
    description: 'Essential tools for traders',
    examples: [
      { name: 'Risk Manager', path: '/risk-management' },
      { name: 'Challenge Blueprint', path: '/challenge-blueprint' },
      { name: 'Session Clock', path: '/session-clock' }
    ],
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-500'
  },
  {
    id: 'crypto',
    name: 'Crypto Tools',
    icon: Bitcoin,
    description: 'Tools for crypto traders',
    examples: [
      { name: 'Crypto Calculator', path: '/crypto-calculator' },
      { name: 'Bitcoin Converter', path: '/binary-to-decimal-converter' },
      { name: 'Wallet Generator', path: '/password-generator' }
    ],
    color: 'from-orange-500/20 to-yellow-500/20',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-500'
  },
  {
    id: 'converters',
    name: 'Converters',
    icon: ArrowLeftRight,
    description: 'Convert between different formats',
    examples: [
      { name: 'Miles to KM', path: '/miles-to-km-converter' },
      { name: 'Binary to Decimal', path: '/binary-to-decimal-converter' },
      { name: 'Hex to RGB', path: '/hex-to-rgb-converter' }
    ],
    color: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-500'
  },
  {
    id: 'games',
    name: 'Fun & Games',
    icon: Gamepad,
    description: 'Entertainment with a purpose',
    examples: [
      { name: 'Typing Speed Test', path: '/typing-speed-tester' },
      { name: 'Random Generator', path: '/random-generator' },
      { name: 'Trader Games', path: '/trader-games' }
    ],
    color: 'from-indigo-500/20 to-blue-500/20',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-500'
  }
];
