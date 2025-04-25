
import { useEffect, useState } from 'react';

export interface EconomicEvent {
  id: number;
  title: string;
  time: Date;
  impact: 'high' | 'medium' | 'low';
  currency: string;
}

export const getImpactDetails = (impact: string) => {
  switch (impact) {
    case 'high':
      return { color: 'bg-red-500', emoji: '🔴', textColor: 'text-red-500' };
    case 'medium':
      return { color: 'bg-yellow-500', emoji: '🟡', textColor: 'text-yellow-500' };
    case 'low':
      return { color: 'bg-gray-300', emoji: '⚪', textColor: 'text-gray-300' };
    default:
      return { color: 'bg-gray-300', emoji: '⚪', textColor: 'text-gray-300' };
  }
};

export const formatTimeRemaining = (diffMs: number): string => {
  if (diffMs <= 0) return 'Starting now!';
  
  const minutes = Math.floor(diffMs / 1000 / 60);
  const seconds = Math.floor((diffMs / 1000) % 60);
  
  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `Starts in ${hours}h ${mins}m`;
  }
  
  return `Starts in ${minutes}m ${seconds}s`;
};

export const useEventCountdown = (event: EconomicEvent | null) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isImminentEvent, setIsImminentEvent] = useState(false);

  useEffect(() => {
    if (!event) {
      setTimeRemaining('No major events remaining today.');
      return;
    }

    const updateCountdown = () => {
      const diff = event.time.getTime() - Date.now();
      
      if (diff <= 0) {
        setTimeRemaining('Starting now!');
        return;
      }
      
      setIsImminentEvent(diff < 5 * 60 * 1000);
      setTimeRemaining(formatTimeRemaining(diff));
    };

    // Initial update
    updateCountdown();
    
    // Update every second
    const timer = setInterval(updateCountdown, 1000);
    
    // Store in localStorage
    localStorage.setItem('pipcraft_next_event', JSON.stringify({
      event,
      lastUpdate: Date.now()
    }));

    return () => clearInterval(timer);
  }, [event]);

  return { timeRemaining, isImminentEvent };
};

