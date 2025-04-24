
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, ArrowRight } from 'lucide-react';

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
    <Card className="p-6 dark:bg-[#0d0d0d] light:bg-white transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marketSessions.map((session) => {
          const { time } = calculateLocalTime(session.offset);
          const isActive = activeSessions.includes(session.name);
          
          return (
            <div 
              key={session.name}
              className={`
                relative p-4 rounded-lg 
                dark:bg-black/40 dark:backdrop-blur-md dark:border-white/5
                light:bg-[#FFFFFF] border
                light:border-gray-200/80 
                dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)]
                light:shadow-[0_2px_15px_rgba(0,0,0,0.08)]
                transition-all duration-300
                ${isActive ? 'dark:border-[#00ff88]/20 light:border-[#0abf53]/20' : ''}
                ${isActive ? 'dark:shadow-[0_0_20px_rgba(0,255,136,0.1)] light:shadow-[0_0_20px_rgba(10,191,83,0.1)]' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs dark:text-gray-400 light:text-gray-600">{session.code}</span>
                  <span className="font-medium dark:text-gray-200 light:text-gray-800">{session.name}</span>
                </div>
                {isActive && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    dark:bg-[#00ff88]/10 dark:text-[#00ff88] dark:shadow-[0_0_10px_rgba(0,255,136,0.2)]
                    light:bg-[#0abf53]/10 light:text-[#0abf53]
                    transition-all duration-300 animate-pulse
                  `}>
                    ACTIVE
                  </span>
                )}
              </div>
              
              <div className="font-mono tracking-wider mb-2 text-2xl font-bold
                dark:text-white light:text-gray-800
                transition-colors duration-300">
                {formatTime(time)}
              </div>
              
              <div className="text-xs flex items-center gap-2
                dark:text-gray-400 light:text-gray-600">
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
    </Card>
  );
};

export default SessionClock;
