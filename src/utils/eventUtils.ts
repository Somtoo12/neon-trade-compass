
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
