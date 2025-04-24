
import React from 'react';
import { PropFirm } from '@/data/propFirms';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';

interface PropFirmComparisonProps {
  firms: PropFirm[];
}

export function PropFirmComparison({ firms }: PropFirmComparisonProps) {
  // Features to compare
  const features = [
    { label: 'Max DD', key: 'drawdown' },
    { label: 'Daily Loss', key: 'dailyLoss' },
    { label: 'Evaluation', key: 'evaluation' },
    { label: 'Refund?', key: 'refund' },
    { label: 'Profit Split', key: 'profitSplit' },
    { label: 'Payout Time', key: 'payout' },
    { label: 'Scaling', key: 'scaling' },
    { label: 'Trial Available', key: 'trial' },
  ] as const;

  // Get color for cells with different values
  const getCellClass = (feature: keyof PropFirm, index: number) => {
    if (firms.length <= 1) return '';
    
    const allSame = firms.every(f => f[feature] === firms[0][feature]);
    if (allSame) return '';
    
    // Determine if this feature is generally considered "better" when higher or lower
    const isBetterHigher = ['profitSplit', 'scaling', 'trial', 'refund'].includes(feature);
    
    // For comparing refund and scaling where values are "✅" or "❌"
    if (feature === 'refund' || feature === 'scaling' || feature === 'trial') {
      return firms[index][feature] === '✅' 
        ? 'bg-green-500/10 text-green-600 dark:text-green-400 font-medium'
        : 'bg-red-500/10 text-red-600 dark:text-red-400 font-medium';
    }
    
    // For numeric comparisons (like profit split)
    if (feature === 'profitSplit') {
      const values = firms.map(f => {
        const match = f[feature].match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      });
      
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);
      const currentValue = values[index];
      
      if (currentValue === maxValue && isBetterHigher) {
        return 'bg-green-500/10 text-green-600 dark:text-green-400 font-medium';
      } else if (currentValue === minValue && !isBetterHigher) {
        return 'bg-green-500/10 text-green-600 dark:text-green-400 font-medium';
      } else if (currentValue === minValue && isBetterHigher) {
        return 'bg-red-500/10 text-red-600 dark:text-red-400 font-medium';
      } else if (currentValue === maxValue && !isBetterHigher) {
        return 'bg-red-500/10 text-red-600 dark:text-red-400 font-medium';
      }
    }
    
    return 'bg-gray-100 dark:bg-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Feature</TableHead>
            {firms.map(firm => (
              <TableHead key={firm.name} className="min-w-[180px]">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 bg-card rounded-md overflow-hidden flex items-center justify-center mb-2">
                    <img 
                      src={firm.logo} 
                      alt={`${firm.name} logo`} 
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <span className="font-bold">{firm.name}</span>
                  {firm.ranking <= 5 && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Trophy className="h-3 w-3 mr-1 text-orange-500" /> Rank #{firm.ranking}
                    </div>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map(feature => (
            <TableRow key={feature.key}>
              <TableCell className="font-medium">{feature.label}</TableCell>
              {firms.map((firm, index) => (
                <TableCell 
                  key={`${firm.name}-${feature.key}`}
                  className={`text-center ${getCellClass(feature.key as keyof PropFirm, index)}`}
                >
                  {firm[feature.key as keyof PropFirm]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
