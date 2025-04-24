
import React, { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Image } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import ChecklistItem from './ChecklistItem';
import ChecklistHistory, { HistoryItem } from './ChecklistHistory';
import { format } from 'date-fns';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  isCustom?: boolean;
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
  const [clearNotesOnReset, setClearNotesOnReset] = useState(true);
  const [lastReset, setLastReset] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedChecklist = localStorage.getItem('tradingChecklist');
    const savedNotes = localStorage.getItem('tradingNotes');
    const savedClearNotesOnReset = localStorage.getItem('clearNotesOnReset');
    const savedLastReset = localStorage.getItem('lastChecklistReset');
    const savedHistory = localStorage.getItem('tradingChecklistHistory');

    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      setChecklist(defaultItems);
    }

    if (savedNotes) setNotes(savedNotes);
    if (savedClearNotesOnReset) setClearNotesOnReset(JSON.parse(savedClearNotesOnReset));
    if (savedLastReset) {
      setLastReset(savedLastReset);
      checkIfResetNeeded(savedLastReset);
    } else {
      const now = new Date().toISOString();
      setLastReset(now);
      localStorage.setItem('lastChecklistReset', now);
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (checklist.length > 0) {
      localStorage.setItem('tradingChecklist', JSON.stringify(checklist));
    }
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('tradingNotes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('clearNotesOnReset', JSON.stringify(clearNotesOnReset));
  }, [clearNotesOnReset]);

  useEffect(() => {
    localStorage.setItem('tradingChecklistHistory', JSON.stringify(history));
  }, [history]);

  // Reset and time management functions
  const checkIfResetNeeded = (lastResetTime: string) => {
    const now = new Date();
    const lastReset = new Date(lastResetTime);
    
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const estLastReset = new Date(lastReset.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    const isPast5PM = estNow.getHours() >= 17;
    const lastResetBefore5PM = estLastReset.getHours() < 17;
    const isDifferentDay = estNow.getDate() !== estLastReset.getDate() || 
                          estNow.getMonth() !== estLastReset.getMonth() || 
                          estNow.getFullYear() !== estLastReset.getFullYear();
    
    if ((isPast5PM && lastResetBefore5PM) || isDifferentDay) {
      // First, save the current checklist to history before resetting
      saveChecklistToHistory();
      // Then reset for new day
      resetChecklist();
    }
  };

  const saveChecklistToHistory = () => {
    // Only save if there's at least one checked item (meaning the checklist was used)
    const hasActivity = checklist.some(item => item.checked) || notes.trim().length > 0;
    if (!hasActivity) return;

    const completionPercentage = Math.round(
      (checklist.filter(item => item.checked).length / checklist.length) * 100
    );

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if we already have an entry for today
    const existingEntryIndex = history.findIndex(item => item.date.startsWith(today));

    const newHistoryItem: HistoryItem = {
      date: new Date().toISOString(),
      checklist: [...checklist],
      notes: notes,
      completionPercentage
    };

    if (existingEntryIndex >= 0) {
      // Update today's entry
      const updatedHistory = [...history];
      updatedHistory[existingEntryIndex] = newHistoryItem;
      setHistory(updatedHistory);
    } else {
      // Add new entry and limit to 7 days
      const updatedHistory = [newHistoryItem, ...history].slice(0, 7);
      setHistory(updatedHistory);
    }
  };

  const resetChecklist = () => {
    setChecklist(prev => {
      const customItems = prev.filter(item => item.isCustom);
      return [...defaultItems, ...customItems.map(item => ({ ...item, checked: false }))];
    });
    
    if (clearNotesOnReset) setNotes('');
    
    const now = new Date().toISOString();
    setLastReset(now);
    localStorage.setItem('lastChecklistReset', now);
    
    toast({
      title: "Trading checklist reset",
      description: "Your checklist has been reset for a new trading day.",
    });
  };

  // Checklist item management
  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addCustomItem = () => {
    const text = window.prompt('Enter new checklist item:');
    if (text && text.trim() !== '') {
      const newItem: ChecklistItem = {
        id: `custom-${Date.now()}`,
        text: text.trim(),
        checked: false,
        isCustom: true
      };
      setChecklist([...checklist, newItem]);
    }
  };

  const editCustomItem = (id: string, newText: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, text: newText } : item
    ));
  };

  const deleteCustomItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  // Manual save of today's checklist to history
  const saveCurrentToHistory = () => {
    saveChecklistToHistory();
    toast({
      title: "Checklist saved to history",
      description: "Today's checklist has been added to your 7-day history."
    });
  };

  // Screenshot functionality
  const exportScreenshot = async () => {
    const element = document.getElementById('trading-checklist-card');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1A1F2C',
        scale: 2,
      });

      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `Trade-Checklist-${date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Screenshot saved!",
        description: `Exported as ${link.download}`,
      });
    } catch (error) {
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot.",
        variant: "destructive",
      });
    }
  };

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (checklist.filter(item => item.checked).length / checklist.length) * 100
  );

  // Format next reset time
  const formatNextReset = () => {
    const now = new Date();
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const resetTime = new Date(estNow);
    resetTime.setHours(17, 0, 0, 0);
    
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
    <div className="space-y-4" id="trading-checklist-card">
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
          <span>Today's Checklist</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-2">
            {checklist.map((item) => (
              <ChecklistItem
                key={item.id}
                {...item}
                onToggle={toggleItem}
                onEdit={item.isCustom ? editCustomItem : undefined}
                onDelete={item.isCustom ? deleteCustomItem : undefined}
              />
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addCustomItem}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Item
            </Button>

            <div className="pt-4 space-y-4">
              <div>
                <Label htmlFor="trading-notes" className="block mb-2 text-sm">
                  Notes for today
                </Label>
                <Textarea
                  id="trading-notes"
                  placeholder="Add trading notes for today..."
                  className="w-full h-24 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportScreenshot}
                  className="gap-2"
                >
                  <Image className="h-4 w-4" />
                  Export Screenshot
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={saveCurrentToHistory}
                  className="gap-2"
                >
                  Save Today's Progress
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <ChecklistHistory historyItems={history} />
    </div>
  );
};

export default TradingChecklist;
