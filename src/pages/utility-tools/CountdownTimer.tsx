
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, AlertTriangle, Play, Pause, RotateCcw, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('12:00');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);
  const [eventName, setEventName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        const now = new Date();
        const target = new Date(`${targetDate}T${targetTime}`);
        const difference = target.getTime() - now.getTime();

        if (difference <= 0) {
          clearInterval(interval);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          toast({
            title: eventName || "Countdown Complete",
            description: "The countdown has reached zero!",
            variant: "default",
          });
          setIsActive(false);
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, targetDate, targetTime, eventName, toast]);

  const startCountdown = () => {
    if (!targetDate) {
      toast({
        title: "Date Required",
        description: "Please select a target date for the countdown.",
        variant: "destructive",
      });
      return;
    }

    // Check if date is in the past
    const now = new Date();
    const target = new Date(`${targetDate}T${targetTime}`);
    
    if (target <= now) {
      toast({
        title: "Invalid Date",
        description: "The target date and time must be in the future.",
        variant: "destructive",
      });
      return;
    }

    setIsActive(true);
  };

  const pauseCountdown = () => {
    setIsActive(false);
  };

  const resetCountdown = () => {
    setIsActive(false);
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setEventName('');
    // Don't reset the date/time to make it easier to restart
  };

  const shareCountdown = () => {
    if (!targetDate) {
      toast({
        title: "Nothing to Share",
        description: "Please set a countdown first.",
        variant: "destructive",
      });
      return;
    }

    const shareText = `Countdown to ${eventName || 'Event'}: ${targetDate} ${targetTime}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Countdown',
        text: shareText,
        url: window.location.href,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(`${shareText} - Create your own countdown at ${window.location.href}`);
      toast({
        title: "Copied to Clipboard",
        description: "Countdown details copied to clipboard!",
      });
    }
  };

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTargetDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <AppLayout activeSection="utilities" setActiveSection={() => {}}>
      <Helmet>
        <title>Countdown Timer | PipCraft Tools</title>
        <meta name="description" content="Create a live countdown to any future date and time. Perfect for events, deadlines, launches, and tracking important moments." />
        <link rel="canonical" href="https://pipcrafts.com/countdown-timer" />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pt-4 pb-16"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Countdown Timer
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create a countdown to any important date and time. Perfect for events, deadlines, launches, or any moment that matters.
            </p>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/30">
            <CardContent className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Event Name (Optional)</label>
                    <Input
                      type="text"
                      placeholder="Enter event name"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="border border-border input-glow min-h-[44px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Target Date</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-10 border border-border input-glow min-h-[44px]"
                        disabled={isActive}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Target Time</label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={targetTime}
                        onChange={(e) => setTargetTime(e.target.value)}
                        className="pl-10 border border-border input-glow min-h-[44px]"
                        disabled={isActive}
                      />
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    {!isActive ? (
                      <Button 
                        onClick={startCountdown} 
                        className="min-h-[44px] bg-primary hover:bg-primary/90"
                      >
                        <Play className="mr-2 h-4 w-4" /> Start Countdown
                      </Button>
                    ) : (
                      <Button 
                        onClick={pauseCountdown}
                        variant="outline" 
                        className="min-h-[44px]"
                      >
                        <Pause className="mr-2 h-4 w-4" /> Pause
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      onClick={resetCountdown}
                      className="min-h-[44px]"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={shareCountdown}
                      className="min-h-[44px]"
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center w-full">
                    {(isActive || (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0)) ? (
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-center">{eventName || "Time Remaining"}</h3>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-secondary/30 backdrop-blur-sm p-3 rounded-lg">
                            <div className="text-3xl md:text-4xl font-bold">{formatNumber(timeLeft.days)}</div>
                            <div className="text-xs text-muted-foreground mt-1">Days</div>
                          </div>
                          <div className="bg-secondary/30 backdrop-blur-sm p-3 rounded-lg">
                            <div className="text-3xl md:text-4xl font-bold">{formatNumber(timeLeft.hours)}</div>
                            <div className="text-xs text-muted-foreground mt-1">Hours</div>
                          </div>
                          <div className="bg-secondary/30 backdrop-blur-sm p-3 rounded-lg">
                            <div className="text-3xl md:text-4xl font-bold">{formatNumber(timeLeft.minutes)}</div>
                            <div className="text-xs text-muted-foreground mt-1">Minutes</div>
                          </div>
                          <div className="bg-secondary/30 backdrop-blur-sm p-3 rounded-lg">
                            <div className="text-3xl md:text-4xl font-bold">{formatNumber(timeLeft.seconds)}</div>
                            <div className="text-xs text-muted-foreground mt-1">Seconds</div>
                          </div>
                        </div>
                        
                        {!isActive && (
                          <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Countdown is paused
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6 border border-dashed border-border rounded-lg bg-card/30">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">Set your countdown details and press Start</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <article className="prose prose-sm dark:prose-invert max-w-none mt-8 px-4">
            <h2 className="text-xl font-semibold mb-3">The Power of Countdowns</h2>
            <p>
              Countdowns create anticipation and urgency, making them powerful tools for events, product launches, deadlines, and special occasions. A visible countdown timer helps manage time expectations and builds excitement as the moment approaches.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Using Countdown Timers Effectively</h2>
            <p>
              Countdown timers are versatile tools that can be used for both personal and professional purposes. For businesses, they create urgency during sales or product launches. For individuals, they help track important deadlines or celebrations. 
              Consider using our <Link to="/qr-code-generator" className="text-primary hover:underline">QR Code Generator</Link> to create sharable QR codes that link directly to your countdown for event promotions.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Time Management with Countdowns</h2>
            <p>
              Countdowns are excellent productivity tools. By setting visible deadlines, you create accountability and motivation to complete tasks before time runs out. For traders tracking economic events, combine this tool with our <Link to="/economic-calendar" className="text-primary hover:underline">Economic Calendar</Link> to prepare for market-moving announcements.
            </p>
          </article>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default CountdownTimer;
