
import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HistoryItem {
  min: number;
  max: number;
  result: number;
  timestamp: Date;
}

interface GenerationHistoryProps {
  history: HistoryItem[];
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({ history }) => {
  const [showStats, setShowStats] = useState(false);
  
  const calculateStats = () => {
    if (history.length === 0) return null;
    
    const sum = history.reduce((acc, curr) => acc + curr.result, 0);
    const avg = sum / history.length;
    const sortedResults = [...history].map(h => h.result).sort((a, b) => a - b);
    const median = sortedResults.length % 2 === 0 
      ? (sortedResults[sortedResults.length / 2 - 1] + sortedResults[sortedResults.length / 2]) / 2
      : sortedResults[Math.floor(sortedResults.length / 2)];
    
    return {
      min: Math.min(...sortedResults),
      max: Math.max(...sortedResults),
      avg: avg.toFixed(2),
      median: median,
      count: history.length
    };
  };

  const stats = calculateStats();

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Recent Results</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowStats(!showStats)}
          className="text-xs flex gap-1 items-center"
        >
          <BarChart2 className="h-3 w-3" /> {showStats ? 'Hide Stats' : 'Show Stats'}
        </Button>
      </div>
      
      {showStats && stats && (
        <Card className="bg-secondary/20 border-border/30 mb-3">
          <CardContent className="p-3 text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <div className="text-muted-foreground">Count:</div>
                <div className="font-medium">{stats.count}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Average:</div>
                <div className="font-medium">{stats.avg}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Lowest:</div>
                <div className="font-medium">{stats.min}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Highest:</div>
                <div className="font-medium">{stats.max}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="max-h-[240px] overflow-y-auto pr-1 space-y-1">
        {history.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm p-1.5 hover:bg-secondary/10 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">
                {new Intl.DateTimeFormat('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                }).format(item.timestamp)}
              </span>
              <span className="text-muted-foreground">
                [{item.min} - {item.max}]
              </span>
            </div>
            <span className="font-medium">{item.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerationHistory;
