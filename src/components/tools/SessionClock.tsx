
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface MarketSession {
  name: string;
  timezone: string;
  offset: number;
  startHour: number;
  endHour: number;
}

const SessionClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  
  const marketSessions: MarketSession[] = [
    { name: 'Sydney', timezone: 'AEDT', offset: 10, startHour: 7, endHour: 16 },
    { name: 'Tokyo', timezone: 'JST', offset: 9, startHour: 9, endHour: 18 },
    { name: 'London', timezone: 'BST', offset: 1, startHour: 8, endHour: 16 },
    { name: 'New York', timezone: 'EDT', offset: -4, startHour: 8, endHour: 17 },
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate time in a specific timezone
  const calculateLocalTime = (offset: number): {time: Date, hour: number} => {
    // Get UTC time in milliseconds
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    // Create new Date object for the timezone
    const localTime = new Date(utc + (3600000 * offset));
    return {
      time: localTime,
      hour: localTime.getHours()
    };
  };
  
  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };
  
  // Check if session is active
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
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Trading Session Clock</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {marketSessions.map((session) => {
          const { time } = calculateLocalTime(session.offset);
          const isActive = activeSessions.includes(session.name);
          
          return (
            <div 
              key={session.name}
              className={`p-4 rounded-lg flex flex-col items-center transition-all duration-300 border ${
                isActive 
                  ? 'active-session' 
                  : 'border-white/5 bg-black/30'
              }`}
            >
              <div className="mb-2 text-lg font-medium">{session.name}</div>
              <div className="text-muted-foreground text-xs mb-3">{session.timezone}</div>
              
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                isActive 
                  ? 'border-neon-green animate-pulse-glow neon-green-glow' 
                  : 'border-white/20'
              }`}>
                <Clock className={`h-8 w-8 ${isActive ? 'text-neon-green' : 'text-muted-foreground'}`} />
              </div>
              
              <div className="mt-4 text-xl font-medium">{formatTime(time)}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {isActive ? 'Market Open' : 'Market Closed'}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        Times shown reflect regular trading hours. Extended hours may vary.
      </div>
    </Card>
  );
};

export default SessionClock;
