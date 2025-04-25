
export const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-gray-300';
    default: return 'bg-gray-300';
  }
};

export const getImpactEmoji = (impact: string) => {
  switch (impact) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '⚪';
    default: return '⚪';
  }
};

export interface CalendarEvent {
  id: number;
  title: string;
  time: Date;
  impact: 'high' | 'medium' | 'low';
  currency: string;
}

// Add sample events for the economic calendar
export const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: 'Non-Farm Payrolls',
    time: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes from now
    impact: 'high',
    currency: 'USD'
  },
  {
    id: 2,
    title: 'Interest Rate Decision',
    time: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    impact: 'high',
    currency: 'EUR'
  },
  {
    id: 3,
    title: 'GDP',
    time: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    impact: 'medium',
    currency: 'GBP'
  },
  {
    id: 4,
    title: 'CPI Data',
    time: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
    impact: 'medium',
    currency: 'JPY'
  },
  {
    id: 5,
    title: 'Unemployment Rate',
    time: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
    impact: 'low',
    currency: 'AUD'
  }
];

export const findNextEvent = (events: CalendarEvent[]) => {
  const now = new Date();
  return events
    .filter(event => event.time > now)
    .sort((a, b) => a.time.getTime() - b.time.getTime())[0] || null;
};

export const formatTimeRemaining = (targetTime: Date): string => {
  const diff = targetTime.getTime() - Date.now();
  
  if (diff <= 0) return 'Starting now!';
  
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor((diff / 1000) % 60);
  
  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `Starts in ${hours}h ${mins}m`;
  }
  
  return `Starts in ${minutes}m ${seconds}s`;
};
