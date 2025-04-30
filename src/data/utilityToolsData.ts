
import {
  QrCode, Clock, Timer, Calculator, Calendar, Dice6
} from 'lucide-react';

export interface UtilityTool {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
  icon: any;
  shortDescription?: string;
}

export const utilityToolsData: UtilityTool[] = [
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes from text or links that can be easily scanned',
    shortDescription: 'Generate QR codes from URLs or text',
    path: '/qr-code-generator',
    category: 'Utilities',
    icon: QrCode
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Set a target date and time to see a live countdown',
    shortDescription: 'Set a date/time for live countdown',
    path: '/countdown-timer',
    category: 'Utilities',
    icon: Clock
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    description: 'Count characters, words, and paragraphs in your text in real-time',
    shortDescription: 'Count characters, words & paragraphs',
    path: '/character-counter',
    category: 'Utilities',
    icon: Timer
  },
  {
    id: 'tip-calculator',
    name: 'Tip Split Calculator',
    description: 'Calculate tips and split bills easily among multiple people',
    shortDescription: 'Split bills and calculate tips instantly',
    path: '/tip-calculator',
    category: 'Utilities',
    icon: Calculator
  },
  {
    id: 'date-calculator',
    name: 'Date Difference Calculator',
    description: 'Calculate the exact difference between two dates in days, weeks, months, and years',
    shortDescription: 'Find differences between dates',
    path: '/date-calculator',
    category: 'Utilities',
    icon: Calendar
  },
  {
    id: 'random-generator',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a specified range',
    shortDescription: 'Generate random numbers in a range',
    path: '/random-generator',
    category: 'Utilities',
    icon: Dice6
  }
];
