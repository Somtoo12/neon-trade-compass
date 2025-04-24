import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Globe } from 'lucide-react';

interface MarketSession {
  code: string;
  name: string;
  timezone: string;
  offset: number;
  startHour: number;
  endHour: number;
  marketCode: string;
}

const SessionClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  
  const marketSessions: MarketSession[] = [
    { code: 'US', name: 'New York', timezone: 'EDT', offset: -4, startHour: 9.5, endHour: 16, marketCode: 'NY' },
    { code: 'GB', name: 'London', timezone: 'BST', offset: 1, startHour: 8, endHour: 16.5, marketCode: 'LDN' },
    { code: 'JP', name: 'Tokyo', timezone: 'JST', offset: 9, startHour: 9, endHour: 15, marketCode: 'TKY' },
    { code: 'AU', name: 'Sydney', timezone: 'AEST', offset: 10, startHour: 10, endHour: 16, marketCode: 'SYD' },
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const calculateLocalTime = (offset: number): {time: Date, hour: number} => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (3600000 * offset));
    return {
      time: localTime,
      hour: localTime.getHours() + (localTime.getMinutes() / 60)
    };
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentTimezone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
  
  useEffect(() => {
    const active: string[] = [];
    
    marketSessions.forEach(session => {
      const { hour } = calculateLocalTime(session.offset);
      if (hour >= session.startHour && hour < session.endHour) {
        active.push(session.name);
      }
    });
    
    setActiveSessions(active);
  }, [currentTime]);
  
  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="text-center space-y-2 bg-black/40 backdrop-blur-md dark:border-white/5 light:bg-[#FFFFFF] rounded-xl p-6 border light:border-gray-200/80 dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] light:shadow-[0_2px_15px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-center gap-2 dark:text-gray-400 light:text-gray-600 mb-4">
            <Globe className="h-5 w-5" />
            <span>Your Local Time</span>
          </div>
          <div className="text-4xl font-bold font-mono tracking-wider dark:text-[#00ff94] light:text-gray-800">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm dark:text-gray-400 light:text-gray-700">
            {formatDate(currentTime)}
          </div>
          <div className="text-xs dark:text-gray-500 light:text-gray-600">
            Timezone: {getCurrentTimezone()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketSessions.map((session) => {
            const { time } = calculateLocalTime(session.offset);
            const isActive = activeSessions.includes(session.name);
            
            return (
              <div 
                key={session.name}
                className={`relative p-4 rounded-lg dark:bg-gradient-to-br dark:from-gray-100 dark:to-gray-200 light:bg-[#FFFFFF] border dark:border-gray-300/50 light:border-gray-200/80 dark:shadow-sm light:shadow-[0_2px_10px_rgba(0,0,0,0.05)] ${
                  isActive ? 'border-primary/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">{session.code}</span>
                    <span className="font-medium text-gray-800">{session.name}</span>
                  </div>
                  {isActive && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                
                <div className="text-2xl font-mono tracking-wider mb-2 text-gray-800">
                  {formatTime(time)}
                </div>
                
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <span>{session.marketCode}</span>
                  <span>•</span>
                  <span>
                    Market {isActive ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-black/40 backdrop-blur-md dark:border-white/5 light:bg-[#FFFFFF] rounded-lg border light:border-gray-200/80 dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] light:shadow-[0_2px_15px_rgba(0,0,0,0.08)]">
          <h3 className="text-sm font-medium mb-3 dark:text-gray-300 light:text-gray-800">Trading Hours (Local Market Time)</h3>
          <div className="space-y-2 text-sm dark:text-gray-400 light:text-gray-700">
            <div className="flex gap-2">
              <span className="text-xs text-gray-600">US</span>
              New York (NYSE): 9:30 AM - 4:00 PM ET, Mon-Fri
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-gray-600">GB</span>
              London (LSE): 8:00 AM - 4:30 PM GMT, Mon-Fri
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-gray-600">JP</span>
              Tokyo (TSE): 9:00 AM - 3:00 PM JST, Mon-Fri
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-gray-600">AU</span>
              Sydney (ASX): 10:00 AM - 4:00 PM AEST, Mon-Fri
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SessionClock;
