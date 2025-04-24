
import { format, isToday, isTomorrow, isWithinInterval, addHours, formatDistance } from 'date-fns';

export const formatEventTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const time = format(date, 'HH:mm');
  
  if (isToday(date)) return `${time} - Today`;
  if (isTomorrow(date)) return `${time} - Tomorrow`;
  return `${time} - ${format(date, 'MMM d')}`;
};

export const isUpcoming = (dateStr: string) => {
  const date = new Date(dateStr);
  return isWithinInterval(date, {
    start: new Date(),
    end: addHours(new Date(), 1)
  });
};

export const isPast = (dateStr: string) => {
  return new Date(dateStr) < new Date();
};

export const getCountdown = (dateStr: string) => {
  const eventDate = new Date(dateStr);
  const now = new Date();
  
  if (eventDate <= now) {
    return 'Just happened';
  }
  
  return formatDistance(eventDate, now, { addSuffix: false });
};
