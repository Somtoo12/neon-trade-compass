
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronDown, ChevronUp, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

export interface HistoryItem {
  date: string;
  checklist: Array<{
    id: string;
    text: string;
    checked: boolean;
    isCustom?: boolean;
  }>;
  notes: string;
  completionPercentage: number;
}

interface ChecklistHistoryProps {
  historyItems: HistoryItem[];
}

const ChecklistHistory: React.FC<ChecklistHistoryProps> = ({ historyItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleItem = (date: string) => {
    setExpandedItem(expandedItem === date ? null : date);
  };

  const exportScreenshot = async (date: string, item: HistoryItem) => {
    // Create a temporary element to render the checklist
    const tempElement = document.createElement('div');
    tempElement.style.padding = '20px';
    tempElement.style.backgroundColor = '#1A1F2C';
    tempElement.style.color = 'white';
    tempElement.style.fontFamily = 'system-ui, sans-serif';
    tempElement.style.borderRadius = '8px';
    tempElement.style.width = '600px';
    
    // Format date for display
    const displayDate = format(new Date(date), 'MMMM d, yyyy');
    
    // Create the content HTML
    tempElement.innerHTML = `
      <div style="margin-bottom: 16px">
        <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px">Trading Checklist - ${displayDate}</h3>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px">
          <div style="font-size: 14px">Completion: ${item.completionPercentage}%</div>
          <div style="height: 8px; width: 150px; background-color: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; background-image: linear-gradient(to right, #00ffb3, #7b61ff); border-radius: 4px; width: ${item.completionPercentage}%"></div>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 16px">
        <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 8px">Checklist Items:</h4>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          ${item.checklist.map(checkItem => `
            <li style="padding: 4px 0; display: flex; align-items: center; gap: 8px;">
              <div style="width: 16px; height: 16px; border-radius: 4px; border: 2px solid ${checkItem.checked ? '#00ffb3' : 'rgba(255,255,255,0.5)'}; background-color: ${checkItem.checked ? '#00ffb3' : 'transparent'}; flex-shrink: 0;"></div>
              <span style="font-size: 14px;">${checkItem.text}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      ${item.notes ? `
        <div>
          <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 8px">Notes:</h4>
          <p style="font-size: 14px; white-space: pre-wrap;">${item.notes}</p>
        </div>
      ` : ''}
    `;
    
    document.body.appendChild(tempElement);
    
    try {
      const canvas = await html2canvas(tempElement, {
        backgroundColor: '#1A1F2C',
        scale: 2,
      });
      
      document.body.removeChild(tempElement);
      
      const link = document.createElement('a');
      link.download = `Checklist-${format(new Date(date), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Screenshot saved!",
        description: `Exported as ${link.download}`,
      });
    } catch (error) {
      document.body.removeChild(tempElement);
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot.",
        variant: "destructive",
      });
    }
  };

  if (!historyItems.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <Separator className="my-6" />
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:bg-secondary/50 rounded-md px-2">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            🗂️ Past 7 Days
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="space-y-4 pt-2">
            {historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(item => {
                const itemDate = new Date(item.date);
                const isExpanded = expandedItem === item.date;
                const formattedDate = format(itemDate, 'MMM d, yyyy');
                
                return (
                  <div 
                    key={item.date} 
                    className="border border-border/50 rounded-md overflow-hidden bg-card/50"
                  >
                    <div 
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/30"
                      onClick={() => toggleItem(item.date)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.completionPercentage === 100 ? 'bg-neon-green' : 'bg-muted'}`}></div>
                        <span className="font-medium">{formattedDate}</span>
                        <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{item.completionPercentage}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="gap-1 h-7 text-xs px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportScreenshot(item.date, item);
                          }}
                        >
                          <Image className="h-3.5 w-3.5" />
                          Export
                        </Button>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-3 pt-0 border-t border-border/30 bg-background/20">
                        <div className="pt-3 space-y-3">
                          <div>
                            <h4 className="text-xs font-medium mb-2">Checklist Items</h4>
                            <div className="space-y-1">
                              {item.checklist.map(checkItem => (
                                <div key={checkItem.id} className="flex items-start gap-2">
                                  <div className={`w-4 h-4 rounded-sm mt-0.5 border flex items-center justify-center ${checkItem.checked ? 'bg-primary border-primary' : 'border-input'}`}>
                                    {checkItem.checked && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-3 w-3 text-primary-foreground"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="text-sm">{checkItem.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {item.notes && (
                            <div>
                              <h4 className="text-xs font-medium mb-2">Notes</h4>
                              <div className="text-sm bg-secondary/20 rounded-md p-2 whitespace-pre-wrap">
                                {item.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ChecklistHistory;
