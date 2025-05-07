
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DateRange = {
  from: Date;
  to: Date;
};

export type DateRangeOption = {
  label: string;
  value: string;
  range: DateRange | (() => DateRange);
};

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Predefined date ranges
  const dateRangeOptions: DateRangeOption[] = [
    {
      label: 'Today',
      value: 'today',
      range: () => {
        const today = new Date();
        return {
          from: today,
          to: today,
        };
      },
    },
    {
      label: 'Yesterday',
      value: 'yesterday',
      range: () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          from: yesterday,
          to: yesterday,
        };
      },
    },
    {
      label: 'Last 7 days',
      value: 'last7days',
      range: () => {
        const today = new Date();
        const last7days = new Date(today);
        last7days.setDate(last7days.getDate() - 6);
        return {
          from: last7days,
          to: today,
        };
      },
    },
    {
      label: 'Last 30 days',
      value: 'last30days',
      range: () => {
        const today = new Date();
        const last30days = new Date(today);
        last30days.setDate(last30days.getDate() - 29);
        return {
          from: last30days,
          to: today,
        };
      },
    },
    {
      label: 'This month',
      value: 'thisMonth',
      range: () => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          from: firstDayOfMonth,
          to: today,
        };
      },
    },
    {
      label: 'Last month',
      value: 'lastMonth',
      range: () => {
        const today = new Date();
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          from: firstDayOfLastMonth,
          to: lastDayOfLastMonth,
        };
      },
    },
    {
      label: 'Custom range',
      value: 'custom',
      range: { from: value.from, to: value.to },
    },
  ];

  // Find the matching predefined option
  const getSelectedOption = (): DateRangeOption | undefined => {
    const from = value.from;
    const to = value.to;

    return dateRangeOptions.find((option) => {
      if (option.value === 'custom') return false;

      const range =
        typeof option.range === 'function' ? option.range() : option.range;
      
      return (
        format(from, 'yyyy-MM-dd') === format(range.from, 'yyyy-MM-dd') &&
        format(to, 'yyyy-MM-dd') === format(range.to, 'yyyy-MM-dd')
      );
    });
  };

  const selectedOption = getSelectedOption();
  const selectedValue = selectedOption ? selectedOption.value : 'custom';

  const handleRangeChange = (option: DateRangeOption) => {
    const range = typeof option.range === 'function' ? option.range() : option.range;
    onChange(range);
    if (option.value === 'custom') {
      setIsCalendarOpen(true);
    } else {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select
        value={selectedValue}
        onValueChange={(value) => {
          const option = dateRangeOptions.find((o) => o.value === value);
          if (option) handleRangeChange(option);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'flex-1 justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: value.from,
              to: value.to,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onChange(range as DateRange);
              }
            }}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
