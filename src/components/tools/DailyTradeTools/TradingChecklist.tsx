
import React, { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

const defaultItems: ChecklistItem[] = [
  { id: 'economic-calendar', text: 'Checked economic calendar?', checked: false },
  { id: 'loss-limit', text: 'Know today\'s daily loss limit?', checked: false },
  { id: 'stop-loss', text: 'Set stop loss on all trades?', checked: false },
  { id: 'bias', text: 'Bias confirmed (bullish/bearish)?', checked: false },
  { id: 'strategy', text: 'Breakout vs. range strategy selected?', checked: false },
  { id: 'drawdown', text: 'Drawdown buffer verified?', checked: false },
];

const TradingChecklist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [notes, setNotes] = useState('');
  const [lastReset, setLastReset] = useState<string | null>(null);
  const { toast } = useToast();

  // Init and load from localStorage
  useEffect(() => {
    const savedChecklist = localStorage.getItem('tradingChecklist');
    const savedNotes = localStorage.getItem('tradingNotes');
    const savedLastReset = localStorage.getItem('lastChecklistReset');

    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      setChecklist(defaultItems);
    }

    if (savedNotes) {
      setNotes(savedNotes);
    }

    if (savedLastReset) {
      setLastReset(savedLastReset);
      checkIfResetNeeded(savedLastReset);
    } else {
      // Initialize last reset time
      const now = new Date().toISOString();
      setLastReset(now);
      localStorage.setItem('lastChecklistReset', now);
    }
  }, []);

  // Save to localStorage whenever checklist or notes change
  useEffect(() => {
    if (checklist.length > 0) {
      localStorage.setItem('tradingChecklist', JSON.stringify(checklist));
    }
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('tradingNotes', notes);
  }, [notes]);

  // Check if reset is needed (5 PM EST)
  const checkIfResetNeeded = (lastResetTime: string) => {
    const now = new Date();
    const lastReset = new Date(lastResetTime);
    
    // Convert current time to EST (UTC-5)
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const estLastReset = new Date(lastReset.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    // Check if it's past 5 PM EST and the last reset was before 5 PM EST today
    const isPast5PM = estNow.getHours() >= 17;
    const lastResetBefore5PM = estLastReset.getHours() < 17;
    const isDifferentDay = estNow.getDate() !== estLastReset.getDate() || 
                           estNow.getMonth() !== estLastReset.getMonth() || 
                           estNow.getFullYear() !== estLastReset.getFullYear();
    
    if ((isPast5PM && lastResetBefore5PM) || isDifferentDay) {
      resetChecklist();
    }
  };

  // Reset checklist to defaults
  const resetChecklist = () => {
    setChecklist(defaultItems);
    const now = new Date().toISOString();
    setLastReset(now);
    localStorage.setItem('lastChecklistReset', now);
    toast({
      title: "Trading checklist reset",
      description: "Your checklist has been reset for a new trading day.",
    });
  };
  
  // Toggle checklist item
  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };
  
  // Calculate completion percentage
  const completionPercentage = Math.round(
    (checklist.filter(item => item.checked).length / checklist.length) * 100
  );

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  // Format the reset time to be more readable
  const formatNextReset = () => {
    // Create a date for 5 PM EST today
    const now = new Date();
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const resetTime = new Date(estNow);
    resetTime.setHours(17, 0, 0, 0);
    
    // If it's already past 5 PM, set for tomorrow
    if (estNow.getHours() >= 17) {
      resetTime.setDate(resetTime.getDate() + 1);
    }
    
    return resetTime.toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm text-muted-foreground">
            Completion: <span className="font-medium">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full max-w-[150px] mt-1 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-green to-neon-purple rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Next reset: {formatNextReset()} EST
        </div>
      </div>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:bg-secondary/50 rounded-md px-2">
          <span>Daily Checklist Items</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-2">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Switch
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <Label 
                  htmlFor={item.id}
                  className={item.checked ? "line-through opacity-70" : ""}
                >
                  {item.text}
                </Label>
              </div>
            ))}

            <div className="pt-3">
              <Label htmlFor="trading-notes" className="block mb-2 text-sm">
                Notes for today
              </Label>
              <Textarea
                id="trading-notes"
                placeholder="Add trading notes for today..."
                className="w-full h-24 resize-none"
                value={notes}
                onChange={handleNotesChange}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TradingChecklist;
