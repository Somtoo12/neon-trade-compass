
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash, Calendar, MoreVertical, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

export interface HistoryItem {
  id: string;
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
  onDeleteEntry?: (entryId: string) => void;
  onDeleteDayEntries?: (date: string) => void;
}

const ChecklistHistory: React.FC<ChecklistHistoryProps> = ({ 
  historyItems, 
  onDeleteEntry,
  onDeleteDayEntries
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { toast } = useToast();

  // Group items by date
  const groupedItems = historyItems.reduce((groups, item) => {
    const date = new Date(item.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  const toggleItem = (date: string) => {
    setExpandedItem(expandedItem === date ? null : date);
  };

  const exportScreenshot = async (item: HistoryItem) => {
    const elementId = `checklist-entry-${item.id}`;
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1A1F2C',
        scale: 2,
      });

      const link = document.createElement('a');
      const timestamp = format(new Date(item.date), 'yyyy-MM-dd-HHmm');
      link.download = `PipCraftChecklist-${timestamp}.png`;
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

  return (
    <div className="mt-6">
      <Separator className="my-6" />
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:bg-secondary/50 rounded-md px-2">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            🗂️ Past 7 Days
          </span>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="space-y-6 pt-2">
            {Object.entries(groupedItems).map(([date, items]) => (
              <div key={date} className="border border-border/50 rounded-md overflow-hidden bg-card/50">
                <div className="p-3 border-b border-border/30 flex items-center justify-between bg-secondary/20">
                  <h3 className="text-sm font-medium">{format(new Date(items[0].date), 'MMMM d, yyyy')}</h3>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Delete All for {format(new Date(items[0].date), 'MMM d, yyyy')}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete all entries for this day?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all checklist entries for {format(new Date(items[0].date), 'MMMM d, yyyy')}.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteDayEntries?.(date)}>
                              Delete All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="divide-y divide-border/30">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      id={`checklist-entry-${item.id}`} 
                      className="p-3 hover:bg-secondary/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.date), 'h:mm a')}
                          </span>
                          <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded">
                            {item.completionPercentage}% Complete
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportScreenshot(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Image className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this checklist entry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this checklist entry from {format(new Date(item.date), 'MMMM d, yyyy')} at {format(new Date(item.date), 'h:mm a')}.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteEntry?.(item.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {item.checklist.map((checkItem) => (
                          <div key={checkItem.id} className="flex items-start gap-2">
                            <div className={`w-4 h-4 rounded-sm mt-0.5 border flex items-center justify-center ${
                              checkItem.checked ? 'bg-primary border-primary' : 'border-input'
                            }`}>
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

                      {item.notes && (
                        <div className="mt-3">
                          <div className="text-sm bg-secondary/20 rounded-md p-2 whitespace-pre-wrap">
                            {item.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ChecklistHistory;
