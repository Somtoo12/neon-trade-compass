
import React, { useState } from 'react';
import { Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface FilterProps {
  filters: {
    evaluationType: string[];
    drawdownModel: string[];
    profitShare: string[];
    refundPolicy: string[];
    fastPayout: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    evaluationType: string[];
    drawdownModel: string[];
    profitShare: string[];
    refundPolicy: string[];
    fastPayout: boolean;
  }>>;
}

export function PropFirmFilter({ filters, setFilters }: FilterProps) {
  const [open, setOpen] = useState(false);
  
  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (typeof filters[category] === 'boolean') {
      setFilters({ ...filters, [category]: !filters[category] });
    } else {
      const currentValues = filters[category] as string[];
      if (currentValues.includes(value)) {
        setFilters({ 
          ...filters, 
          [category]: currentValues.filter(v => v !== value) 
        });
      } else {
        setFilters({ 
          ...filters, 
          [category]: [...currentValues, value] 
        });
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      evaluationType: [],
      drawdownModel: [],
      profitShare: [],
      refundPolicy: [],
      fastPayout: false,
    });
  };

  // Count active filters
  const activeFiltersCount = 
    filters.evaluationType.length +
    filters.drawdownModel.length +
    filters.profitShare.length +
    filters.refundPolicy.length +
    (filters.fastPayout ? 1 : 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4" align="end">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Filter Options</h4>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-4 mt-2">
          {/* Evaluation Type */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Evaluation Type</h5>
            <div className="grid grid-cols-2 gap-2">
              {["1-Step", "2-Step", "Instant"].map(type => (
                <Button
                  key={type}
                  variant={filters.evaluationType.includes(type) ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => toggleFilter("evaluationType", type)}
                >
                  {filters.evaluationType.includes(type) && <Check className="mr-1 h-3 w-3" />}
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Drawdown Model */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Drawdown Model</h5>
            <div className="grid grid-cols-2 gap-2">
              {["Trailing", "Static", "Equity"].map(model => (
                <Button
                  key={model}
                  variant={filters.drawdownModel.includes(model) ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => toggleFilter("drawdownModel", model)}
                >
                  {filters.drawdownModel.includes(model) && <Check className="mr-1 h-3 w-3" />}
                  {model}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Profit Share */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Profit Share</h5>
            <div className="grid grid-cols-3 gap-2">
              {["70", "80", "90"].map(share => (
                <Button
                  key={share}
                  variant={filters.profitShare.includes(share) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter("profitShare", share)}
                >
                  {filters.profitShare.includes(share) && <Check className="mr-1 h-3 w-3" />}
                  {share}%+
                </Button>
              ))}
            </div>
          </div>
          
          {/* Refund Policy */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Refund Policy</h5>
            <div className="grid grid-cols-2 gap-2">
              {["Yes", "No"].map(policy => (
                <Button
                  key={policy}
                  variant={filters.refundPolicy.includes(policy) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter("refundPolicy", policy)}
                >
                  {filters.refundPolicy.includes(policy) && <Check className="mr-1 h-3 w-3" />}
                  {policy}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Fast Payout */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="fast-payout">Fast Payout (≤ 7 days)</Label>
            </div>
            <Switch
              id="fast-payout"
              checked={filters.fastPayout}
              onCheckedChange={() => setFilters({...filters, fastPayout: !filters.fastPayout})}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
