
import * as React from 'react'
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange
}) => {
  const [quickSelect, setQuickSelect] = React.useState<string>("custom");
  
  const handleQuickSelect = (period: string) => {
    setQuickSelect(period);
    
    const now = new Date();
    let from: Date;
    
    switch (period) {
      case "today":
        from = new Date(now);
        from.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        from = new Date(now);
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        break;
      case "7days":
        from = addDays(now, -7);
        break;
      case "30days":
        from = addDays(now, -30);
        break;
      case "90days":
        from = addDays(now, -90);
        break;
      default:
        return;
    }
    
    onChange({ from, to: now });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={quickSelect}
        onValueChange={handleQuickSelect}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "MMM d, yyyy")} -{" "}
                  {format(value.to, "MMM d, yyyy")}
                </>
              ) : (
                format(value.from, "MMM d, yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={(newValue) => {
              if (newValue?.from !== value?.from || newValue?.to !== value?.to) {
                setQuickSelect("custom");
                onChange(newValue || { from: new Date(), to: new Date() });
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
