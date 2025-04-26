import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';

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
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();
  
  const timeBlocks: TimeBlock[] = [
    { name: 'Asia Session', start: 0, end: 7, color: 'bg-indigo-500', description: 'Lower volatility, ranging conditions' },
    { name: 'London Open', start: 7, end: 10, color: 'bg-blue-500', description: 'High volume, directional moves' },
    { name: 'London Session', start: 10, end: 12, color: 'bg-teal-500', description: 'Moderate volume' },
    { name: 'London/NY Overlap', start: 12, end: 16, color: 'bg-purple-500', description: 'Highest volume and volatility' },
    { name: 'NY Session', start: 16, end: 20, color: 'bg-orange-500', description: 'Moderate to high volume' },
    { name: 'NY Close', start: 20, end: 22, color: 'bg-pink-500', description: 'Decreasing volume' },
    { name: 'Overnight', start: 22, end: 24, color: 'bg-gray-500', description: 'Low volume, consolidation' },
  ];
  
  useEffect(() => {
    const savedEnableAlerts = localStorage.getItem('killZonesEnableAlerts');
    if (savedEnableAlerts) setEnableAlerts(savedEnableAlerts === 'true');
    
    if ('Notification' in window) {
      setNotificationsPermission(Notification.permission);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('killZonesEnableAlerts', enableAlerts.toString());
  }, [enableAlerts]);
  
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support notifications. Please use a modern browser.",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationsPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll be notified before important trading sessions.",
        });
      } else {
        toast({
          title: "Notifications Disabled",
          description: "Enable browser notifications to receive session alerts while multitasking.",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const sendNotification = (title: string, body: string) => {
    if (notificationsPermission === 'granted' && enableAlerts) {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } else {
      toast({
        title,
        description: body,
      });
    }
  };

  const checkForSessionAlerts = () => {
    if (!enableAlerts) return;
    
    const currentGmtHour = getCurrentGmtHour();
    
    timeBlocks.forEach(block => {
      const minutesBeforeSession = ((block.start - currentGmtHour) * 60);
      
      if (minutesBeforeSession > 0 && minutesBeforeSession <= 5 && !hasShownAlert) {
        sendNotification(
          "Trading Session Alert",
          `${block.name} begins in 5 minutes - ${block.description}`
        );
        setHasShownAlert(true);
        
        setTimeout(() => {
          setHasShownAlert(false);
        }, 6 * 60 * 1000);
      }
      
      if (Math.abs(minutesBeforeSession) < 1 && !hasShownAlert) {
        sendNotification(
          "Session Started",
          `${block.name} has begun - ${block.description}`
        );
        setHasShownAlert(true);
      }
    });
  };
  
  const convertGmtToLocal = (gmtHours: number) => {
    const date = new Date();
    date.setUTCHours(gmtHours, 0, 0, 0);
    return date.getHours() + (date.getMinutes() / 60);
  };
  
  const getCurrentGmtHour = () => {
    return currentTime.getUTCHours() + (currentTime.getUTCMinutes() / 60);
  };
  
  const getCurrentSession = () => {
    const currentGmtHour = getCurrentGmtHour();
    
    for (const block of timeBlocks) {
      if (currentGmtHour >= block.start && currentGmtHour < block.end) {
        return block;
      }
    }
    
    return timeBlocks[0];
  };
  
  const formatTimeDisplay = (gmtHour: number) => {
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
          <div className="flex items-center space-x-2">
            <BellRing className="h-4 w-4" />
            <Switch
              id="enable-alerts"
              checked={enableAlerts}
              onCheckedChange={(checked) => {
                setEnableAlerts(checked);
                if (checked && notificationsPermission === 'default') {
                  requestNotificationPermission();
                }
              }}
            />
            <Label htmlFor="enable-alerts">Enable alerts</Label>
          </div>
        </div>
      </div>
      
      {enableAlerts && notificationsPermission === 'granted' && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <BellRing className="h-4 w-4" />
          Notifications active – you'll be alerted 5 mins before key sessions
        </div>
      )}
      
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
