
import {
  QrCode, Clock, Timer, Calculator, Calendar, Dice6, FileText,
  ShieldCheck, ListOrdered, Binary, Award, Palette, Droplet,
  RotateCw, User, ArrowUpDown, Keyboard, Key
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
    description: 'Online countdown timer with alarm for important events',
    shortDescription: 'Online countdown timer with sound alert',
    path: '/countdown-timer',
    category: 'Utilities',
    icon: Clock
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    description: 'Online word counter free tool for text analysis',
    shortDescription: 'Count characters, words & paragraphs',
    path: '/character-counter',
    category: 'Utilities',
    icon: FileText
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
  },
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    description: 'Password strength checker online free for security analysis',
    shortDescription: 'Check password strength tool with recommendations',
    path: '/password-strength-checker',
    category: 'Utilities',
    icon: ShieldCheck
  },
  {
    id: 'number-to-words-converter',
    name: 'Number to Words Converter',
    description: 'Convert numerical values into written words for checks, documents, and more',
    shortDescription: 'Convert numbers to written text',
    path: '/number-to-words-converter',
    category: 'Utilities',
    icon: ListOrdered
  },
  {
    id: 'binary-to-decimal-converter',
    name: 'Binary to Decimal Converter',
    description: 'Convert between binary and decimal number systems with just a click',
    shortDescription: 'Binary/decimal number conversion',
    path: '/binary-to-decimal-converter',
    category: 'Utilities',
    icon: Binary
  },
  {
    id: 'grade-calculator',
    name: 'GPA Calculator',
    description: 'GPA calculator for Nigerian universities and international institutions',
    shortDescription: 'Calculate GPA with credit units input',
    path: '/grade-calculator',
    category: 'Utilities',
    icon: Award
  },
  {
    id: 'hex-to-rgb-converter',
    name: 'Hex to RGB Converter',
    description: 'Convert hex color codes to RGB values with instant color preview',
    shortDescription: 'Convert color formats with preview',
    path: '/hex-to-rgb-converter',
    category: 'Utilities',
    icon: Palette
  },
  {
    id: 'daily-water-intake-calculator',
    name: 'Daily Water Intake Calculator',
    description: 'Calculate how much water you should drink daily based on age, weight, and activity level',
    shortDescription: 'Personalized hydration recommendations',
    path: '/daily-water-intake-calculator',
    category: 'Utilities',
    icon: Droplet
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    description: 'Instantly reverse any text - letters, words, and sentences will appear backwards',
    shortDescription: 'Reverse text for fun or puzzles',
    path: '/text-reverser',
    category: 'Utilities',
    icon: RotateCw
  },
  {
    id: 'username-generator',
    name: 'Username Generator',
    description: 'Create unique username suggestions based on keywords for social media, gaming, and more',
    shortDescription: 'Generate creative username ideas',
    path: '/username-generator',
    category: 'Utilities',
    icon: User
  },
  {
    id: 'miles-to-km-converter',
    name: 'Unit Converter',
    description: 'Convert between miles and kilometers, Fahrenheit and Celsius, pounds and kilograms',
    shortDescription: 'Convert between measurement units',
    path: '/miles-to-km-converter',
    category: 'Utilities',
    icon: ArrowUpDown
  },
  {
    id: 'typing-speed-tester',
    name: 'Typing Speed Tester',
    description: 'Test your typing speed and accuracy to improve your keyboard efficiency',
    shortDescription: 'Measure WPM and typing accuracy',
    path: '/typing-speed-tester',
    category: 'Utilities',
    icon: Keyboard
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, secure passwords with customizable options for maximum security',
    shortDescription: 'Generate secure random passwords',
    path: '/password-generator',
    category: 'Utilities',
    icon: Key
  }
];
