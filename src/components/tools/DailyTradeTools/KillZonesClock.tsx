
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TimeBlock {
  name: string;
  start: number; // Hours in GMT
  end: number; // Hours in GMT
  color: string;
  description: string;
}

const KillZonesClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [enableAlerts, setEnableAlerts] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const { toast } = useToast();
  
  // Define market sessions (all times in GMT)
  const timeBlocks: TimeBlock[] = [
    { name: 'Asia Session', start: 0, end: 7, color: 'bg-indigo-500', description: 'Lower volatility, ranging conditions' },
    { name: 'London Open', start: 7, end: 10, color: 'bg-blue-500', description: 'High volume, directional moves' },
    { name: 'London Session', start: 10, end: 12, color: 'bg-teal-500', description: 'Moderate volume' },
    { name: 'London/NY Overlap', start: 12, end: 16, color: 'bg-purple-500', description: 'Highest volume and volatility' },
    { name: 'NY Session', start: 16, end: 20, color: 'bg-orange-500', description: 'Moderate to high volume' },
    { name: 'NY Close', start: 20, end: 22, color: 'bg-pink-500', description: 'Decreasing volume' },
    { name: 'Overnight', start: 22, end: 24, color: 'bg-gray-500', description: 'Low volume, consolidation' },
  ];
  
  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedEnableAlerts = localStorage.getItem('killZonesEnableAlerts');
    if (savedEnableAlerts) setEnableAlerts(savedEnableAlerts === 'true');
  }, []);
  
  // Save to localStorage whenever these values change
  useEffect(() => {
    localStorage.setItem('killZonesEnableAlerts', enableAlerts.toString());
  }, [enableAlerts]);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkForSessionAlerts();
    }, 60000);
    
    // Initial check for alerts
    checkForSessionAlerts();
    
    return () => clearInterval(timer);
  }, [enableAlerts, hasShownAlert]);
  
  // Convert GMT hours to local time
  const convertGmtToLocal = (gmtHours: number) => {
    const date = new Date();
    date.setUTCHours(gmtHours, 0, 0, 0);
    return date.getHours() + (date.getMinutes() / 60);
  };
  
  // Get current hour in GMT
  const getCurrentGmtHour = () => {
    return currentTime.getUTCHours() + (currentTime.getUTCMinutes() / 60);
  };
  
  // Check which session is currently active
  const getCurrentSession = () => {
    const currentGmtHour = getCurrentGmtHour();
    
    for (const block of timeBlocks) {
      if (currentGmtHour >= block.start && currentGmtHour < block.end) {
        return block;
      }
    }
    
    return timeBlocks[0]; // Default to Asia session if no match
  };
  
  // Check for upcoming session alerts
  const checkForSessionAlerts = () => {
    if (!enableAlerts || hasShownAlert) return;
    
    const currentGmtHour = getCurrentGmtHour();
    const londonNyOverlapBlock = timeBlocks.find(block => block.name === 'London/NY Overlap');
    
    if (!londonNyOverlapBlock) return;
    
    // 5 minutes before London/NY overlap (12 GMT)
    const minutesBeforeOverlap = ((londonNyOverlapBlock.start - currentGmtHour) * 60);
    
    if (minutesBeforeOverlap > 0 && minutesBeforeOverlap <= 5) {
      toast({
        title: "Trading Session Alert",
        description: "London/NY overlap begins in 5 minutes - high volatility expected",
      });
      setHasShownAlert(true);
      
      // Reset after the session has begun
      setTimeout(() => {
        setHasShownAlert(false);
      }, 6 * 60 * 1000); // 6 minutes
    }
  };
  
  // Format time display for the time blocks
  const formatTimeDisplay = (gmtHour: number) => {
    // Convert GMT hour to local time
    const date = new Date();
    date.setUTCHours(gmtHour, 0, 0, 0);
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  const currentSession = getCurrentSession();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Current Time: {currentTime.toLocaleTimeString()}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enable-alerts"
            checked={enableAlerts}
            onCheckedChange={setEnableAlerts}
          />
          <Label htmlFor="enable-alerts">Enable alerts</Label>
        </div>
      </div>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary px-3 py-2 text-sm font-medium border-b border-border">
          You're in <span className="font-bold text-accent">{currentSession.name}</span> — {currentSession.description}
        </div>
        
        <div className="space-y-1 p-1">
          {timeBlocks.map((block, index) => (
            <div key={index} className="relative">
              <div 
                className={`px-3 py-2 text-sm rounded flex justify-between items-center ${
                  currentSession.name === block.name 
                    ? `${block.color} text-white neon-glow` 
                    : 'bg-secondary'
                }`}
                style={currentSession.name === block.name ? {'--glow-color': 'rgba(123,97,255,0.8)'} as React.CSSProperties : {}}
              >
                <span className="font-medium">{block.name}</span>
                <span>
                  {formatTimeDisplay(block.start)} - {formatTimeDisplay(block.end)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        All times shown in your local timezone. Sessions based on standard GMT market hours.
      </div>
    </div>
  );
};

export default KillZonesClock;
